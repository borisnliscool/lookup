import { writable } from 'svelte/store';

export const localStorageStore = <T>(key: string, defaultValue?: T) => {
	const store = writable<T>(defaultValue);
	if (!defaultValue) store.set(JSON.parse(localStorage.getItem(key) || ''));
	store.subscribe((value) => localStorage.setItem(key, JSON.stringify(value)));
	return store;
};
