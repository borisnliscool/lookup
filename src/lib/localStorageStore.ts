import { writable } from 'svelte/store';

export const localStorageStore = <T>(key: string, defaultValue?: T) => {
	const store = writable<T>(defaultValue);
	store.set(JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue)));
	store.subscribe((value) => localStorage.setItem(key, JSON.stringify(value)));
	return store;
};
