<script lang="ts">
	import { onMount } from 'svelte';
	import type { PBResponse, PBRecord, PBResponseKeys } from '$lib/utils/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { pb } from '$lib/pocketbase';
	import { Select, Spinner } from 'flowbite-svelte';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	export let recordType = createTypeProp<RecordGeneric>();
	recordType;

	//

	export let collection: string;
	export let value: string | undefined = undefined;

	export let displayFields: PBResponseKeys<PBResponse<RecordGeneric>>[] = [];
	export let disabled = false;
	export let name: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let excludeIds: string[] = [];

	//

	$: recordsPromise = loadRecords(excludeIds);

	async function loadRecords(excludeIds: string[]) {
		return await pb.collection(collection).getFullList<PBResponse<RecordGeneric>>({
			requestKey: null,
			filter: excludeIds.map((eId) => `id != ${eId}`).join(' && ')
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

	//

	function createLabel(record: PBResponse<RecordGeneric>) {
		const fields: string[] = [...displayFields];
		if (fields.length === 0) fields.push(...Object.keys(record));
		return fields
			.map((f) => record[f])
			.filter((f) => Boolean(f))
			.join(' | ');
	}

	function createItems(records: PBResponse<RecordGeneric>[]) {
		return records.map((r) => ({ name: createLabel(r), value: r.id }));
	}

	//

	function handleInput(e: Event) {
		// @ts-ignore
		value = e.target.value;
	}
</script>

{#await recordsPromise}
	<Spinner />
{:then records}
	{@const items = createItems(records)}
	<Select {placeholder} {disabled} {name} {items} {value} on:input={handleInput} />
{/await}
