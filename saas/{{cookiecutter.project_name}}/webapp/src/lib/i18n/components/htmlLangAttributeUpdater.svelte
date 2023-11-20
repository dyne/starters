<script lang="ts">
	import { browser } from '$app/environment';
	import { locale } from '$i18n/i18n-svelte';
	import type { Locales } from '$i18n/i18n-types';

	//

	$: updateHTMLLangAttribute($locale);

	// source: https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit/blob/main/src/lib/LocaleSwitcher.svelte
	function updateHTMLLangAttribute(locale: Locales) {
		if (!browser) return;
		document.querySelector('html')?.setAttribute('lang', locale);
	}
</script>
