import type { PlayerActivityAlert } from '../app';
import { localStorageStore } from './localStorageStore';

export const alertsStore = localStorageStore<PlayerActivityAlert[]>('alerts', []);
