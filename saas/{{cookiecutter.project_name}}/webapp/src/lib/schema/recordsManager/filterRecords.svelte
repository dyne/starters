<script lang="ts">
	import { Button, Search, Select } from 'flowbite-svelte';
	import { getRecordsManagerContext } from './recordsManager.svelte';
	import { MagnifyingGlass } from 'svelte-heros-v2';
	import { getCollectionSchema } from '../getCollectionSchema';

	export let searchableFields: string[] | undefined = undefined;
	export let placeholder: string = 'Search...';
	export let allFieldsCaption: string = 'All fields';

	const { dataManager, collection } = getRecordsManagerContext();
	const { queryParams } = dataManager;
	const allFields = getCollectionSchema(collection)?.schema?.map((field) => field.name) ?? [];
	let selected: string = allFieldsCaption;
	let fields: { value: string; name: string }[] = [allFieldsCaption]
		.concat(searchableFields || allFields)
		.map((field) => ({
			value: field,
			name: field
		}));
	let queryString = '';
	const handleSearch = () => {
		if (selected === allFieldsCaption) {
			$queryParams.filter = (searchableFields || allFields)
				.reduce((acc: string[], field) => {
					acc.push(`${field} ~ '${queryString}'`);
					return acc;
				}, [])
				.join(' || ');
		} else {
			$queryParams.filter = `${selected} ~ '${queryString}'`;
		}
	};
</script>

<form class="flex gap-2">
	<Select items={fields} bind:value={selected} class="!w-fit" />
	<Search
		size="lg"
		bind:value={queryString}
		on:input={() => {
			handleSearch();
		}}
		{placeholder}
	/>
</form>
