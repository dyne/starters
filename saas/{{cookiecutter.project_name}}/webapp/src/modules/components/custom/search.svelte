<script lang="ts" context="module">
	export type SearchResult<T> = {
		label: string;
		value: T;
	};

	export type SearchFunction<T> = (searchText: string) => Promise<SearchResult<T>[]>;
</script>

<script lang="ts" generics="T">
	import { createToggleStore } from '$lib/components/utils/toggleStore';

	import { m } from '$lib/i18n';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import Button from '@/components/ui/button/button.svelte';
	import Icon from './icon.svelte';
	import { SearchIcon } from 'lucide-svelte';
	import pDebounce from 'debounce';

	export let placeholder = m.Search();

	export let searchFunction: SearchFunction<T> = async () => [];
	export let selectFunction: (item: T) => void = () => {};
	export let closeOnSelect = true;

	let loading = false;
	let debouncedSearch = pDebounce(async (text: string) => {
		const res = await searchFunction(text);
		loading = false;
		return res;
	}, 400);

	let searchText = '';
	let searchResultPromise: SearchResult<T>[] | undefined = undefined;
	$: handleSearch(searchText);

	async function handleSearch(text: string) {
		loading = true;
		searchResultPromise = await debouncedSearch(text);
	}

	const isListOpen = createToggleStore(false);
</script>

<Popover.Root bind:open={$isListOpen}>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} class="w-full items-start" variant="outline">
			<Icon src={SearchIcon} mr />
			{m.Search()}
		</Button>
	</Popover.Trigger>

	<Popover.Content class="p-0" overlap align="center" sameWidth>
		<Command.Root>
			<Command.Input {placeholder} bind:value={searchText} />
			<Command.List>
				<Command.Empty>{m.No_results_found()}</Command.Empty>
				{#if loading}
					<Command.Loading>Fetching words…</Command.Loading>
				{:else if searchResultPromise}
					<Command.Group heading={m.Search_results()}>
						{#each searchResultPromise as result}
							<Command.Item
								onSelect={() => {
									if (closeOnSelect) isListOpen.off();
									selectFunction(result.value);
								}}
							>
								{result.label}
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
