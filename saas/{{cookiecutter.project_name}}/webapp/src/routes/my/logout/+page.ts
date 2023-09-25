import { browser } from '$app/environment';
import { currentUser, pb } from '$lib/pocketbase';
import { rolesStore } from '$lib/roles';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	if (browser) {
		localStorage.clear();
		pb.authStore.clear();
		currentUser.set(null);
		rolesStore.set({});
		throw redirect(303, '/');
	}
};
