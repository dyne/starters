import { pb } from '$lib/pocketbase';
import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';
import { fetchUserAuthorizations } from '$lib/roles';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const organizationId = params.id;
		const organization = await pb
			.collection(Collections.Organizations)
			.getOne<OrganizationsResponse>(organizationId);

		const user = pb.authStore.model;

		// if (user) await fetchUserAuthorizations(user.id);

		return { organization };
	} catch (e) {
		throw redirect(303, '/my/organizations');
	}
};
