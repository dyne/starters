import { pb } from '$lib/pocketbase';
import type { OrgRole } from './roles';

import { type OrgAuthorizationsResponse, type OrgRolesResponse } from '$lib/pocketbase/types';

export async function getUserRole(organizationId: string, userId: string): Promise<OrgRole> {
	const orgAuthorization = await pb
		.collection('orgAuthorizations')
		.getFirstListItem<
			OrgAuthorizationsResponse<{ role: OrgRolesResponse }>
		>(`organization.id = '${organizationId}' && user.id = '${userId}'`, {
			expand: 'role',
			requestKey: null
		});

	return orgAuthorization.expand?.role.name as OrgRole;
}
