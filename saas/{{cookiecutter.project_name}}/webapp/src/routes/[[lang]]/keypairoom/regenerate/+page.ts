import { loadFeatureFlags } from '$lib/features';
import { getUserPublicKeys } from '$lib/keypairoom/utils';
import { redirect } from '$lib/i18n';

export const load = async ({ url, fetch }) => {
	const { KEYPAIROOM, AUTH } = await loadFeatureFlags(fetch);

	if (KEYPAIROOM && AUTH) {
		const publicKeys = await getUserPublicKeys(undefined, fetch);
		if (!publicKeys) redirect('/my/keypairoom', url);
	}
};
