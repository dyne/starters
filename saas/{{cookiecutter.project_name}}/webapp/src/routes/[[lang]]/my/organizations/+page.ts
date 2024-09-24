// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase/index.js';
import {
	Collections,
	OrgJoinRequestsStatusOptions,
	type OrgJoinRequestsResponse,
	type UsersResponse,
	type OrganizationsResponse,
	type OrgAuthorizationsResponse,
	type OrgRolesResponse
} from '$lib/pocketbase/types.js';

export const load = async ({ fetch }) => {
	const user = pb.authStore.model as UsersResponse;

	type Authorizations = Required<
		OrgAuthorizationsResponse<{
			organization: OrganizationsResponse;
			role: OrgRolesResponse;
		}>
	>;

	const authorizations = await pb
		.collection(Collections.OrgAuthorizations)
		.getFullList<Authorizations>({
			filter: `user = "${pb.authStore.model!.id}"`,
			expand: 'organization,role',
			fetch,
			requestKey: null
		});

	const orgJoinRequests = await pb
		.collection(Collections.OrgJoinRequests)
		.getFullList<OrgJoinRequestsResponse<{ organization: OrganizationsResponse }>>({
			fetch,
			filter: `user.id = "${user.id}" && status = "${OrgJoinRequestsStatusOptions.pending}"`,
			expand: 'organization',
			requestKey: null
		});

	return { orgJoinRequests, authorizations };
};
