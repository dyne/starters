<script lang="ts" context="module">
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { BaseSystemFields, CollectionRecords, RecordIdString } from '@/pocketbase/types';
	import type { RecordPresenter } from './utils';

	export type RecordSearchOptions<R> = {
		recordPresenter: RecordPresenter<R>;
		exclude: RecordIdString[];
		disabled: boolean;
		label: string | undefined;
		placeholder: string | undefined;
	};
</script>

<script lang="ts" generics="C extends CollectionName">
	import type { RecordFullListOptions } from 'pocketbase';
	import { pb } from '@/pocketbase';
	import {
		searchTextFilter,
		excludeIdsFilter,
		mergeFilters,
		defaultRecordPresenter
	} from './utils';

	import Search from '@/components/custom/search.svelte';
	import type { SearchFunction } from '@/components/custom/search.svelte';

	//

	export let collection: C;
	export let options: Partial<RecordSearchOptions<CollectionRecords[C]>> = {};

	let { label, placeholder } = options;

	//

	type R = CollectionRecords[C];

	function createSearchFunction(
		collection: C,
		options: Partial<RecordSearchOptions<R>> = {}
	): SearchFunction<R> {
		const { exclude = [], recordPresenter = defaultRecordPresenter(collection) } = options;

		return async (text: string | undefined) => {
			const options: RecordFullListOptions = {
				requestKey: null
			};
			if (exclude.length > 0) options.filter = excludeIdsFilter(exclude);
			if (text) options.filter = mergeFilters(options.filter, searchTextFilter(collection, text));

			const records = await pb.collection(collection).getFullList<R & BaseSystemFields>(options);
			return records.map((item) => ({
				value: item,
				...recordPresenter(item),
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
	searchFn={createSearchFunction(collection, options)}
	onSelect={(item) => {
		console.log(item);
	}}
	{label}
	{placeholder}
	disabled={options.disabled}
>
	<!-- <svelte:fragment slot="item" let:item>
			<slot name="item" item={typeCaster(item)}></slot>
	</svelte:fragment> -->
</Search>
