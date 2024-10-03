import { createSessionStorageHandlers } from '$lib/utils/sessionStorage';

type OrganizationInviteSession = {
	organizationId: string;
	inviteId: string;
	email: string;
};

export const OrganizationInviteSession =
	createSessionStorageHandlers<OrganizationInviteSession>('organization_invite');
