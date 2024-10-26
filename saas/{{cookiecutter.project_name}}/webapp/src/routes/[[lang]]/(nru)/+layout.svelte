<script lang="ts">
	import LanguageSelect from '@/i18n/languageSelect.svelte';
	import { appTitle } from '@/utils/strings';
	import A from '@/components/custom/a.svelte';
	import PageCard from '@/components/layout/pageCard.svelte';
</script>

<div class="flex h-screen items-center justify-center">
	<div class="max-w-[500px] space-y-4">
		<A href="/">
			<img class="mr-2 h-10" src="/logo.svg" alt={`${appTitle} Logo`} />
		</A>
		<PageCard>
			<slot />
		</PageCard>
	</div>
</div>

<div class="fixed right-4 top-4 !m-0">
	<LanguageSelect />
</div>
