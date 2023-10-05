import { writable } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import {
	Collections,
	type OrganizationAuthorizationsResponse,
	type OrganizationRolesResponse
} from '$lib/pocketbase/types';
import { browser } from '$app/environment';

//

type Authorization = OrganizationAuthorizationsResponse<{ role: OrganizationRolesResponse }>;
type RolesRecord = Record<string, OrganizationRolesResponse>;

export const rolesStore = writable<RolesRecord>({});

export async function fetchUserAuthorizations(userId: string) {
	const authorizations = await pb
		.collection(Collections.OrganizationAuthorizations)
		.getFullList<Authorization>({
			filter: `user.id="${userId}"`,
			expand: 'role',
			requestKey: null
		});

	if (browser) rolesStore.set(createRolesRecord(authorizations));

	return authorizations;
}

export function findUserRole(authorizations: Authorization[], organizationId: string) {
	return authorizations.find((a) => a.organization === organizationId)?.expand?.role;
}

export function createRolesRecord(authorizations: Authorization[]): RolesRecord {
	const rolesRecord: RolesRecord = {};
	for (const { organization } of authorizations) {
		const role = findUserRole(authorizations, organization);
		if (role) rolesRecord[organization] = role;
	}
	return rolesRecord;
}
