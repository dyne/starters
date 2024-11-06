<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script lang="ts">
	import { page } from '$app/stores';
	import { getLanguagesData, m, type LanguageData } from '.';
	import { Languages } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';
	import * as Popover from '@/components/ui/popover';
	import { Button } from '@/components/ui/button';
	import { languageTag } from '.';
	import type { Snippet } from 'svelte';
	import type { Builder } from 'bits-ui';
	import type { IconComponent } from '@/components/types';
	import { Store } from 'runed';

	interface Props {
		trigger?: Snippet<
			[
				{
					builder: Builder;
					icon: IconComponent;
					text: string;
					languageData: LanguageData;
				}
			]
		>;
		language?: Snippet<[{ languageData: LanguageData }]>;
	}

	const { trigger, language }: Props = $props();

	const pageState = new Store(page);
	const languagesData = $derived(getLanguagesData(pageState.current));
	const currentLanguage = $derived(languagesData.find((l) => l.tag == languageTag())!);
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		{#if trigger}
			{@render trigger({
				builder,
				icon: Languages,
				text: m.Select_language(),
				languageData: currentLanguage
			})}
		{:else}
			<Button variant="outline" builders={[builder]}>
				<Icon src={Languages} mr />{m.Select_language()}
			</Button>
		{/if}
	</Popover.Trigger>

	<Popover.Content class="p-2" sameWidth>
		{#each languagesData as languageData}
			{#if language}
				{@render language({ languageData })}
			{:else}
				{@const { href, hreflang, name, flag, isCurrent } = languageData}

				<Button
					{href}
					{hreflang}
					variant={isCurrent ? 'secondary' : 'ghost'}
					class="flex items-center justify-start gap-2"
				>
					<span class="text-2xl">
						{flag}
					</span>
					<span>
						{name}
					</span>
				</Button>
			{/if}
		{/each}
	</Popover.Content>
</Popover.Root>
