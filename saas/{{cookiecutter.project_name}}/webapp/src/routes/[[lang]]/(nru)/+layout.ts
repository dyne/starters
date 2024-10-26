import { error } from '@sveltejs/kit';
import { loadFeatureFlags } from '$lib/features';
import { verifyUser } from '$lib/auth/verifyUser';
import { redirect } from '$lib/i18n';

export const load = async ({ url, fetch }) => {
	if (!(await loadFeatureFlags(fetch)).AUTH) error(404);
	if (await verifyUser()) redirect('/my', url);
};
