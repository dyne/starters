import { detectBrowserLocale } from '$i18n/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = () => {
	throw redirect(303, `/${detectBrowserLocale()}`);
};
