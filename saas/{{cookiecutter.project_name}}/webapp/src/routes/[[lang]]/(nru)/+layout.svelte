<script lang="ts">
	import { appTitle } from '$lib/strings';
	import BaseLanguageSwitcher from '$lib/i18n/baseLanguageSwitcher.svelte';
	import Card from '@/components/custom/card.svelte';

	// TODO - Fix
</script>

<div class="grid h-screen place-items-center">
	<div class="max-w-[500px]">
		<a href="/">
			<img class="mr-2 h-10" src="/logo.svg" alt={`${appTitle} Logo`} />
		</a>
		<Card>
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				<slot />
			</div>
		</Card>
	</div>
</div>

<div class="fixed right-4 top-4 !m-0">
	<BaseLanguageSwitcher />
</div>
