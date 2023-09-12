import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase, { type AuthModel } from 'pocketbase';
import { writable } from 'svelte/store';
import type { UsersResponse } from './types';

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
export const currentUser = writable<AuthModel | UsersResponse>(pb.authStore.model);
