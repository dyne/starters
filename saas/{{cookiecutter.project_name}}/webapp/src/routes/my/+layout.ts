import { pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	if (!pb.authStore.model) {
		throw redirect(303, '/login');
	}
};
