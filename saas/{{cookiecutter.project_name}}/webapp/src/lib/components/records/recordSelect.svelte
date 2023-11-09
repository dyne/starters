<script lang="ts">
	import type { RecordInputOptions } from './types';

	import type { Collections } from '$lib/pocketbase/types';

	import { onMount } from 'svelte';
	import type { PBResponse, PBRecord, PBResponseKeys } from '$lib/utils/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { pb } from '$lib/pocketbase';
	import { Select, Spinner } from 'flowbite-svelte';
	import { createRecordLabel, excludeStringArray } from './utils';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	//

	export let collection: string | Collections;
	export let recordId: string | undefined = undefined;
	export let options: Partial<RecordInputOptions<RecordGeneric>> = {};

	let {
		displayFields = [],
		disabled = false,
		name = undefined,
		excludeIds = [],
		required = false,
		placeholder = undefined
	} = options;

	//

	$: recordsPromise = loadRecords(excludeIds);

	async function loadRecords(excludeIds: string[]) {
		return await pb.collection(collection).getFullList<PBResponse<RecordGeneric>>({
			requestKey: null,
			filter: excludeStringArray('id', excludeIds)
		});
	}

	onMount(() => {
		pb.collection(collection).subscribe('*', async function (e) {
			recordsPromise = loadRecords(excludeIds);
		});
		return () => {
			pb.collection(collection).unsubscribe('*');
		};
	});

	function createItems(records: PBResponse<RecordGeneric>[]) {
		return records.map((r) => ({
			name: createRecordLabel(r, displayFields),
			value: r.id
		}));
	}

	function handleInput(e: Event) {
		// @ts-ignore
		recordId = e.target.value;
	}
</script>

{#await recordsPromise}
	<Spinner />
{:then records}
	{@const items = createItems(records)}
	<Select
		{required}
		{placeholder}
		{disabled}
		{name}
		{items}
		value={recordId}
		on:input={handleInput}
	/>
{/await}
