<script lang="ts" generics="C extends CollectionName, Expand extends ExpandQueryOption<C> = never">
	import { type ExpandQueryOption, PocketbaseQuery, type QueryResponse } from '@/pocketbase/query';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import { setupComponentPbSubscriptions } from '@/pocketbase';
	import type { RecordIdString } from '@/pocketbase/types';
	import { createRecordDisplay } from './utils';
	import SelectInput, { type SelectItem } from '@/components/custom/selectInput.svelte';
	import type { CollectionSelectBaseProps } from './types';

	//

	type Props = CollectionSelectBaseProps<C, Expand>;

	let {
		collection,
		queryOptions = {},
		disabled = false,
		placeholder = undefined,
		clearValueOnSelect = false,
		onSelect = () => {},
		displayFields = undefined,
		displayFn = undefined
	}: Props = $props();

	//

	type Record = QueryResponse<C, Expand>;

	let records = $state<Record[]>([]);
	let recordId = $state<RecordIdString | undefined>();
	const selectedRecord = $derived(records.find((r) => r.id == recordId));

	const presentRecord = $derived(function (record: Record) {
		return createRecordDisplay(record, displayFields, displayFn);
	});

	const selectItems: SelectItem[] = $derived.by(() => {
		return records.map((r) => ({
			value: r.id,
			label: presentRecord(r)
		}));
	});

	const loadRecords = $derived(function () {
		const query = new PocketbaseQuery(collection, queryOptions);
		query.getFullList().then((res) => (records = res));
	});

	$effect(() => {
		loadRecords();
	});

	const subscriptionCollections: CollectionName[] = [collection, 'authorizations'];
	for (const c of subscriptionCollections) {
		setupComponentPbSubscriptions(c, () => loadRecords());
	}

	//

	$effect(() => {
		if (!selectedRecord) return;
		onSelect($state.snapshot(selectedRecord) as Record);
		if (clearValueOnSelect) recordId = undefined;
	});
</script>

<SelectInput type="single" items={selectItems} bind:value={recordId} {placeholder} {disabled}>
	{#snippet trigger()}
		{#if selectedRecord}
			{presentRecord(selectedRecord)}
		{/if}
	{/snippet}
</SelectInput>
