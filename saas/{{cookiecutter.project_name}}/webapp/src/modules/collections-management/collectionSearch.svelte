<script lang="ts" context="module">
	import type { CollectionName } from '@/pocketbase/collections-models/types';
</script>

<script lang="ts" generics="C extends CollectionName, Expand extends boolean">
	import {
		searchTextFilter,
		excludeIdsFilter,
		mergeFilters,
		createDefaultRecordPresenter
	} from './utils';

	import Search from '@/components/custom/search.svelte';
	import type { SearchFunction } from '@/components/custom/search.svelte';
	import { getRelationFields } from '@/pocketbase/collections-models/utils';

	import type { ExpandableResponse } from './types';
	import type { RecordIdString } from '@/pocketbase/types';
	import type { RecordPresenter } from './utils';
	import type { RecordFullListOptions } from 'pocketbase';
	import { pb } from '@/pocketbase';

	//

	export let collection: C;
	export let expand: Expand = false as Expand;

	export let exclude: RecordIdString[] = [];
	export let disabled = false;
	export let filter: string | undefined = undefined;
	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	export let onSelect: (record: ExpandableResponse<C, Expand>) => void = () => {};
	export let presenter: RecordPresenter<ExpandableResponse<C, Expand>> =
		createDefaultRecordPresenter(collection);

	//

	function createSearchFunction(
		exclude: RecordIdString[] = [],
		filter: string | undefined = undefined
	): SearchFunction<ExpandableResponse<C, Expand>> {
		return async (text: string | undefined) => {
			const options: RecordFullListOptions = {
				requestKey: null
			};
			if (exclude.length > 0) options.filter = excludeIdsFilter(exclude);
			if (text) options.filter = mergeFilters(options.filter, searchTextFilter(collection, text));
			if (filter) options.fields = mergeFilters(options.filter, filter);
			if (expand) {
				const relationFields = getRelationFields(collection);
				if (relationFields.length > 0) options.expand = relationFields.join(',');
			}

			const records = await pb
				.collection(collection)
				.getFullList<ExpandableResponse<C, Expand>>(options);

			return records.map((item) => ({
				value: item,
				label: presenter(item),
				disabled: false
			}));
		};
	}

	//

	// function typeCaster(value: unknown): CollectionRecords[C] {
	// 	return value as CollectionRecords[C];
	// }
</script>

<Search
	searchFn={createSearchFunction(exclude, filter)}
	{onSelect}
	{label}
	{placeholder}
	{disabled}
/>

<!-- <svelte:fragment slot="item" let:item>
		<slot name="item" item={typeCaster(item)}></slot>
</svelte:fragment> -->
