import { Howl } from 'howler';
import { writable } from 'svelte/store';

export interface Notification {
	id: string;
	message: string;
	type?: NotificationType;
	dismissible?: boolean;
	timeout?: number;
	sound?: Howl;
}

export type NotificationType = 'info' | 'success' | 'error';

const createStore = () => {
	const { subscribe, update } = writable<Notification[]>([]);

	const dismiss = (id: string) => {
		update((all) => {
			const found = all.find((t) => t.id === id);
			found?.sound?.stop();
			return all.filter((t) => t.id !== id);
		});
	};

	const add = (notification: Omit<Notification, 'id'>) => {
		const id = crypto.randomUUID();

		const defaults: Notification = {
			id,
			type: 'info',
			dismissible: true,
			timeout: 10_000,
			message: ''
		};

		const finalNotification = { ...defaults, ...notification };
		update((all) => [finalNotification, ...all]);

		if (finalNotification.sound) finalNotification.sound.play();
		if (finalNotification.timeout) setTimeout(() => dismiss(id), finalNotification.timeout);
	};

	return {
		subscribe,
		add,
		dismiss
	};
};

export const notifications = createStore();
