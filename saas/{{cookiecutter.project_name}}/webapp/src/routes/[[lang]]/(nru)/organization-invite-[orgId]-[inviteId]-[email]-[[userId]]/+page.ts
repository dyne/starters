import { loadFeatureFlags } from '$lib/features/index.js';
import { redirect } from '$lib/i18n/index.js';
import { OrganizationInviteSession } from '$lib/organizations/invites';
import { pb } from '$lib/pocketbase/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
	const featureFlags = await loadFeatureFlags();
	if (!featureFlags.ORGANIZATIONS) error(404);

	if (pb.authStore.token) redirect('/my/organizations', url);
	else {
		OrganizationInviteSession.start({
			organizationId: params.orgId,
			inviteId: params.inviteId,
			email: decodeURIComponent(params.email)
		});
		if (params.userId) redirect('/login', url);
		else redirect('/register', url);
	}
};
