<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '@/i18n';

	import { Toaster } from '@/components/ui/sonner';

	import '../app.postcss';
	import { version } from '$app/environment';
	import { appTitle } from '@/utils/strings';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	console.info(`${appTitle} version: 🔖 ${version}`);
</script>

<ParaglideJS {i18n}>
	{@render children?.()}
</ParaglideJS>

<Toaster richColors closeButton />
