import { featuresNames, isFeatureActive, loadFeatures } from '$lib/features';
import { error } from '@sveltejs/kit';

export const load = async () => {
	const features = await loadFeatures();
	if (!isFeatureActive(features, featuresNames.WEBAUTHN)) {
		throw error(404);
	}
};
