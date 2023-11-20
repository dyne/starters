<script lang="ts">
	import HeadHrefLangs from '$i18n/components/HeadHrefLangs.svelte';
	import HTMLLangAttributeUpdater from '$i18n/components/htmlLangAttributeUpdater.svelte';
</script>

<svelte:head>
	<HeadHrefLangs />
</svelte:head>

<HTMLLangAttributeUpdater />
<slot />
