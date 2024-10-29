import { loadFeatureFlags } from '@/features';

export const ssr = false;

export const load = async ({ fetch }) => {
	await loadFeatureFlags(fetch);
};
