import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		featureFlags: locals.featureFlags,
		user: locals.user
	};
};
