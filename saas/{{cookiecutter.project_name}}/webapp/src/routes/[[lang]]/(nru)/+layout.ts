import { error, redirect } from '@sveltejs/kit';
import { loadFeatureFlags } from '$lib/features';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async () => {
	if (!(await loadFeatureFlags()).AUTH) error(404);
	if (await verifyUser()) redirect(303, '/my');
};
