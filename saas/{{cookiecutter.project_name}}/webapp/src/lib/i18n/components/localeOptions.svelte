<script lang="ts">
	import { locales } from '$i18n/i18n-util';
	import { page } from '$app/stores';
	import { replaceLocaleInUrl } from '$i18n/utils';
	import { locale } from '$i18n/i18n-svelte';
</script>

{#each locales as l}
	{@const href = replaceLocaleInUrl($page.url, l)}
	{@const active = $locale === l}
	<slot
		option={{
			locale: l,
			href,
			active
		}}
	/>
{/each}
