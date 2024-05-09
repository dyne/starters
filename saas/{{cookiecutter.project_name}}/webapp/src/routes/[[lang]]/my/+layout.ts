import { browser } from '$app/environment';
import { verifyUser } from '$lib/auth/verifyUser';
import { loadFeatureFlags } from '$lib/features';
import { getUserPublicKeys } from '$lib/keypairoom/utils.js';
import { getKeyringFromLocalStorage, matchPublicAndPrivateKeys } from '$lib/keypairoom/keypair';
import { missingKeyringParam, welcomeSearchParamKey } from '$lib/utils/constants.js';
import { error, redirect } from '@sveltejs/kit';

//

export const load = async () => {
	const features = await loadFeatureFlags();

	if (!features.AUTH) throw error(404);
	else {
		const isUserLogged = await verifyUser();
		if (!isUserLogged) throw redirect(303, '/login');
	}

	if (features.KEYPAIROOM) {
		const publicKeys = await getUserPublicKeys();
		if (!publicKeys) {
			throw redirect(303, `/keypairoom?${welcomeSearchParamKey}`);
		}

		if (browser) {
			const keyring = getKeyringFromLocalStorage();
			if (!keyring) {
				throw redirect(303, `/keypairoom/regenerate?${missingKeyringParam}`);
			}

			try {
				await matchPublicAndPrivateKeys(publicKeys, keyring);
			} catch (e) {
				throw redirect(303, `/keypairoom/regenerate?${missingKeyringParam}`);
			}
		}
	}
};
