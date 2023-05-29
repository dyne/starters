import { currentUser } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	if (currentUser) {
		throw redirect(303, '/my');
	}
};
