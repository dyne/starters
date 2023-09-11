import { getKeyringFromLocalStorage } from '$lib/keypairoom/keypair';
import { loadFeatureFlags } from '$lib/features';
import { pb } from '$lib/pocketbase';
import { error, redirect } from '@sveltejs/kit';

export const load = async () => {
	const { DID, KEYPAIROOM } = await loadFeatureFlags();
	if (!KEYPAIROOM && !DID) throw error(404);

	const keyring = getKeyringFromLocalStorage();
	if (!keyring) throw redirect(303, '/keypairoom/regenerate');

	const p = await pb.send<{ did: JSON }>('/api/did', {});
	console.log(p);
	return p.did;
};
