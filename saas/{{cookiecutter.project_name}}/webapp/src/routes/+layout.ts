import { loadFeatureFlags } from '$lib/features';
import type { Locales } from '$i18n/i18n-types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { baseLocale } from '$i18n/i18n-util.js';

export const ssr = false;

export const load = async ({ params }) => {
	await loadFeatureFlags();

	// source: https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit/blob/main/src/routes/%2Blayout.ts
	const locale = (params.lang as Locales) ?? baseLocale;
	// load dictionary into memory
	await loadLocaleAsync(locale);

	return { locale };
};
