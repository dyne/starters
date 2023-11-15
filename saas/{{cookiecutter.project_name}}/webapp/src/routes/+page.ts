import { browser } from '$app/environment';
import { detectLocale } from '$i18n/i18n-util';
import { redirect } from '@sveltejs/kit';

export const load = () => {
	if (browser) {
		const locale = detectLocale(() => navigator.languages.map((l) => l.split('-')[0]));
		throw redirect(303, `/${locale}`);
	}
};
