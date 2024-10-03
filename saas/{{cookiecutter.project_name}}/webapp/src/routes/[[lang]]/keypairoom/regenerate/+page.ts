import { loadFeatureFlags } from '$lib/features';
import { getUserPublicKeys } from '$lib/keypairoom/utils';
import { redirect } from '$lib/i18n';

export const load = async ({ url }) => {
	const { KEYPAIROOM, AUTH } = await loadFeatureFlags();

	if (KEYPAIROOM && AUTH) {
		const publicKeys = await getUserPublicKeys();
		if (!publicKeys) redirect('/my/keypairoom', url);
	}
};
