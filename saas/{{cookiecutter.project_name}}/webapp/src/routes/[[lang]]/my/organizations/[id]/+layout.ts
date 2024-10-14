import { pb } from '@/pocketbase';
import { blockNonMembers } from '$lib/organizations';

export const load = async ({ params, fetch }) => {
	const organizationId = params.id;

	await blockNonMembers(organizationId, fetch);

	const organization = await pb.collection('organizations').getOne(organizationId, {
		fetch,
		requestKey: null
	});

	return { organization };
};
