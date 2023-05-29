import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const load = async () => {
	if (pb.authStore.model) {
		throw redirect(303, '/my');
	}
};
