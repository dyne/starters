<script lang="ts">
	import LanguageSelect from '@/i18n/languageSelect.svelte';
	import { AppLogo } from '@/brand';
	import PageCard from '@/components/layout/pageCard.svelte';
	import type { Snippet } from 'svelte';

	//

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex h-screen items-center justify-center">
	<div class="max-w-[500px] space-y-4">
		<AppLogo />
		<PageCard>
			{@render children?.()}
		</PageCard>
	</div>
</div>

<div class="fixed right-4 top-4 !m-0">
	<LanguageSelect />
</div>
