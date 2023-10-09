import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';
import ProtectedOrgLayout from './protectedOrgLayout.svelte';

//

export * from './roles';
export { ProtectedOrgLayout };

//

export async function verifyAuthorizations(organizationId: string) {
	if (!browser) return;
	await pb.send(`/verify-org-authorization`, {
		method: 'POST',
		body: {
			organizationId,
			url: window.location.href
		}
	});
}
