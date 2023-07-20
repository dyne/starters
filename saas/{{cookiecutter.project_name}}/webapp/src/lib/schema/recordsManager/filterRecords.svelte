<script lang="ts">
	import { Button, Search, Select } from 'flowbite-svelte';
	import { getRecordsManagerContext } from './recordsManager.svelte';
	import { MagnifyingGlass } from 'svelte-heros-v2';

	export let searchableFields: string[] = [];

	const { dataManager } = getRecordsManagerContext();
	const { queryParams } = dataManager;
	let selected: string = 'all fields';
	let fields: { value: string; name: string }[] = ['all fields']
		.concat(searchableFields)
		.map((field) => ({
			value: field,
			name: field
		}));
	let queryString = '';
	const handleSearch = () => {
		if (selected === 'all fields') {
			$queryParams.filter = searchableFields
				.reduce((acc: string[], field) => {
					acc.push(`${field} ~ '${queryString}'`);
					return acc;
				}, [])
				.join(' || ');
		} else {
			$queryParams.filter = `${selected} ~ '${queryString}'`;
		}
	};
	$: {
		if (queryString === '') {
			handleSearch();
		}
	}
</script>

<form class="flex gap-2">
	<Select items={fields} bind:value={selected} class="!w-fit" />
	<Search
		size="lg"
		bind:value={queryString}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				handleSearch();
			}
		}}
	/>
	<Button class="!p-2.5" on:click={handleSearch}>
		<MagnifyingGlass size="20" />
	</Button>
</form>
