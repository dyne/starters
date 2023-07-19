<script lang="ts">
	import { Button, Search, Select } from 'flowbite-svelte';
	import { getRecordsManagerContext } from '../recordsManager.svelte';
	import { MagnifyingGlass } from 'svelte-heros-v2';

	const { dataManager } = getRecordsManagerContext();
	let selected: string = 'all fields';
	let fields: { value: string; name: string }[] = ['all fields']
		.concat(['title', 'text']) // searcheable fields
		.map((field) => ({
			value: field,
			name: field
		}));
	const { queryParams } = dataManager;
	let queryString = '';
	const handleSearch = () => {
		if (queryString.length) {
			if (selected === 'all fields') {
				$queryParams.filter = `title ~ '${queryString}' || text ~ '${queryString}'`;
			} else {
				$queryParams.filter = `${selected} ~ '${queryString}'`;
			}
		} else {
			delete $queryParams.filter;
		}
		console.log($queryParams);
	};
</script>

<form class="flex gap-2">
	<Select items={fields} bind:value={selected} size="md" />
	<Search
		size="md"
		on:change={(e) => {
			e.preventDefault();
			queryString = e.target?.value;
		}}
	/>
	<Button class="!p-2.5" on:click={handleSearch}>
		<MagnifyingGlass size="20" />
	</Button>
</form>
