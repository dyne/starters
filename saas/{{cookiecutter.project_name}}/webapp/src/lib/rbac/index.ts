// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import ProtectedOrgLayout from './protectedOrgLayout.svelte';
import ProtectedOrgUI from './protectedOrgUI.svelte';

export * from './roles';
export { ProtectedOrgLayout, ProtectedOrgUI };

//

import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';
import type { OrgRole } from './roles';
import {
	Collections,
	type OrgAuthorizationsResponse,
	type OrgRolesResponse
} from '@/pocketbase/types';

export async function verifyAuthorizations(organizationId: string, fetchFn = fetch) {
	if (!browser) return;
	await pb.send('/verify-org-authorization', {
		method: 'POST',
		body: {
			organizationId,
			url: window.location.href
		},
		requestKey: null,
		fetch: fetchFn
	});
}

export async function verifyRole(organizationId: string, roles: OrgRole[], fetchFn = fetch) {
	await pb.send('/verify-user-role', {
		method: 'POST',
		body: {
			organizationId,
			roles
		},
		requestKey: null,
		fetch: fetchFn
	});
}

export async function getUserRole(organizationId: string, userId: string): Promise<OrgRole> {
	const orgAuthorization = await pb
		.collection(Collections.OrgAuthorizations)
		.getFirstListItem<
			OrgAuthorizationsResponse<{ role: OrgRolesResponse }>
		>(`organization.id = '${organizationId}' && user.id = '${userId}'`, {
			expand: 'role',
			requestKey: null
		});

	return orgAuthorization.expand?.role.name as OrgRole;
}
