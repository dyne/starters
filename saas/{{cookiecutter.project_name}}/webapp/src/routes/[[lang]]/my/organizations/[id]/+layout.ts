import { pb } from '$lib/pocketbase';
import { verifyUserMembership } from '$lib/organizations';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const organizationId = params.id;

	const { isMember } = await verifyUserMembership(organizationId, fetch);
	if (!isMember) error(404);

	const organization = await pb.collection('organizations').getOne(organizationId, {
		fetch,
		requestKey: null
	});

	return { organization };
};
