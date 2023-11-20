// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing type
type Locales = import('$i18n/i18n-types').Locales;
type TranslationFunctions = import('$i18n/i18n-types').TranslationFun;
type Pocketbase = import('pocketbase');

declare namespace App {
	// interface Error {}
	interface Locals {
		pb: Pocketbase.default;
		user: Pocketbase.default['authStore']['model'];
		locale: Locales;
		LL: TranslationFunctions;
	}
	// interface PageData {}
	// interface Platform {}
}
