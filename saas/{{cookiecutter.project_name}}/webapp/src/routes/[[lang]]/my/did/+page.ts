import { getKeyringFromLocalStorage } from '$lib/keypairoom/keypair';
import { loadFeatureFlags } from '$lib/features';
import { pb } from '@/pocketbase';
import { error } from '@sveltejs/kit';
import { redirect } from '$lib/i18n';

export const load = async ({ url, fetch }) => {
	const { DID, KEYPAIROOM } = await loadFeatureFlags(fetch);
	if (!KEYPAIROOM && !DID) error(404);

	const keyring = getKeyringFromLocalStorage();
	if (!keyring) redirect('/keypairoom/regenerate', url);

	const { did } = await pb.send<{ did: JSON }>('/api/did', {});
	return { did };
};
