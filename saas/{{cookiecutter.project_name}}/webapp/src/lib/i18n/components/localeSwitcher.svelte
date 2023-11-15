<script lang="ts">
	// source: https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit/blob/main/src/lib/LocaleSwitcher.svelte

	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { setLocale, locale } from '$i18n/i18n-svelte';
	import type { Locales } from '$i18n/i18n-types';
	import { locales } from '$i18n/i18n-util';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { replaceLocaleInUrl } from '../utils.js';

	const switchLocale = async (newLocale: Locales, updateHistoryState = true) => {
		if (!newLocale || $locale === newLocale) return;
		await loadLocaleAsync(newLocale);
		setLocale(newLocale);
		if (updateHistoryState) {
			history.pushState({ locale: newLocale }, '', replaceLocaleInUrl($page.url, newLocale));
		}
		invalidateAll();
	};

	$: browser && document.querySelector('html')!.setAttribute('lang', $locale);

	const handlePopStateEvent = async ({ state }: PopStateEvent) => switchLocale(state.locale, false);

	$: if (browser) {
		const lang = $page.params.lang as Locales;
		switchLocale(lang, false);
		history.replaceState(
			{ ...history.state, locale: lang },
			'',
			replaceLocaleInUrl($page.url, lang)
		);
	}
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<ul>
	{#each locales as l}
		<li>
			<a class:active={l === $locale} href={replaceLocaleInUrl($page.url, l)}>
				{l}
			</a>
		</li>
	{/each}
</ul>
