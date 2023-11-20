import { browser } from '$app/environment';
import { verifyUser } from '$lib/auth/verifyUser';
import { loadFeatureFlags } from '$lib/features';
import { getKeyringFromLocalStorage } from '$lib/keypairoom/keypair';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const features = await loadFeatureFlags();

	if (!features.AUTH) throw error(404);
	else {
		const isUserLogged = await verifyUser();
		if (!isUserLogged) throw redirect(303, '/login');
	}

	if (features.KEYPAIROOM && browser) {
		const keyring = getKeyringFromLocalStorage();
		if (!keyring) throw redirect(303, `/keypairoom?${url.searchParams.toString()}`);
	}
};
