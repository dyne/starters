<script lang="ts">
	import { setLocale } from '$i18n/i18n-svelte';
	import '../app.postcss';

	export let data;
	setLocale(data.locale);
</script>

<slot />
