import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { goto } from '$app/navigation';

export const actions: Actions = {
	default: async ({ locals }) => {
		locals.pb.authStore.clear();
		locals.user = null;
		goto('/');
		throw redirect(303, '/');
	}
};
