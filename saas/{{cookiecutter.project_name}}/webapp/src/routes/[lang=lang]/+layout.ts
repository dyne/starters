import { setLocale } from '$i18n/i18n-svelte.js';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { detectLocale } from '$i18n/i18n-util.js';

export const load = async ({ params }) => {
	// source: https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit/blob/main/src/routes/%2Blayout.ts
	// source: https://blog.encodeart.dev/typesafe-i18n-with-sveltekit#heading-locale-detection
	const locale = detectLocale(() => [params.lang]);
	await loadLocaleAsync(locale);
	setLocale(locale);

	return { locale };
};
