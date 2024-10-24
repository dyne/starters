<script lang="ts" context="module">
	import type { CollectionName } from '@/pocketbase/collections-models/types';
</script>

<script lang="ts" generics="C extends CollectionName, Expand extends boolean">
	import { onMount } from 'svelte';
	import { pb } from '@/pocketbase';

	import { getRelationFields } from '@/pocketbase/collections-models/utils';

	import type { RecordFullListOptions } from 'pocketbase';

	import type { ExpandableResponse } from './types';
	import type { RecordIdString } from '@/pocketbase/types';
	import {
		createDefaultRecordPresenter,
		excludeIdsFilter,
		mergeFilters,
		type RecordPresenter
	} from './utils';
	import SelectInput, { type Selected } from '@/components/custom/selectInput.svelte';

	//

	// TODO - support two-way binding

	export let collection: C;
	export let expand: Expand = false as Expand;

	export let exclude: RecordIdString[] = [];
	export let disabled = false;
	export let filter: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let clearValueOnSelect = false;

	export let onSelect: (record: ExpandableResponse<C, Expand> | undefined) => void = () => {};
	export let presenter: RecordPresenter<ExpandableResponse<C, Expand>> =
		createDefaultRecordPresenter(collection);

	//

	type ResponseData = ExpandableResponse<C, Expand>;

	let selectOptions: Selected<ResponseData>[] = [];

	async function loadRecords(
		exclude: RecordIdString[] = [],
		filter: string | undefined = undefined
	) {
		const options: RecordFullListOptions = {
			requestKey: null
		};
		if (exclude.length > 0) options.filter = excludeIdsFilter(exclude);
		if (filter) options.filter = mergeFilters(options.filter, filter);
		if (expand) {
			const relationFields = getRelationFields(collection);
			if (relationFields.length > 0) options.expand = relationFields.join(',');
		}

		const records = await pb.collection(collection).getFullList<ResponseData>(options);

		selectOptions = records.map((item) => ({
			value: item,
			label: presenter(item)
		}));
	}

	//

	onMount(() => {
		loadRecords(exclude, filter);

		pb.collection(collection).subscribe('*', () => loadRecords(exclude, filter));

		return () => {
			pb.collection(collection).unsubscribe('*');
		};
	});

	$: loadRecords(exclude, filter);

	//

	let selected: Selected<ResponseData> | undefined = undefined;
	$: {
		onSelect(selected?.value);
		if (clearValueOnSelect) selected = undefined;
	}
</script>

<SelectInput {placeholder} {disabled} items={selectOptions} bind:selected />
