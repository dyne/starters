import { pb } from '$lib/pocketbase';
import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const organizationId = params.id;
		const organization = await pb
			.collection(Collections.Organizations)
			.getOne<OrganizationsResponse>(organizationId);

		const userId = pb.authStore.model?.id;
		if (!organization.owners.includes(userId)) throw new Error('Unauthorized');

		return { organization };
	} catch (e) {
		throw redirect(303, '/my/organizations');
	}
};
