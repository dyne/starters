<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit'
	import { i18n } from '$lib/i18n'

	import '../app.postcss';
	import { version } from '$app/environment';
	console.info(`SAAS version: 🔖 ${version}`);
</script>
<ParaglideJS {i18n}>


<slot />

</ParaglideJS>