import { loadFeatureFlags } from '$lib/features';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { detectBrowserLocale } from '$i18n/utils';

export const ssr = false;

export const load = async () => {
	await loadFeatureFlags();

	// source: https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit/blob/main/src/routes/%2Blayout.ts
	// source: https://blog.encodeart.dev/typesafe-i18n-with-sveltekit#heading-locale-detection
	const locale = detectBrowserLocale();
	await loadLocaleAsync(locale);

	return { locale };
};
