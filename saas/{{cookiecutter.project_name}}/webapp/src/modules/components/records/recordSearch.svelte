<script lang="ts" context="module">
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { CollectionExpands, CollectionResponses, RecordIdString } from '@/pocketbase/types';
	import type { RecordPresenter } from './utils';

	type ExpandableResponse<
		C extends CollectionName,
		Expand extends boolean,
		Response = CollectionResponses[C]
	> = If<Expand, Response & { expand: CollectionExpands[C] }, Response>;
</script>

<script lang="ts" generics="C extends CollectionName, Expand extends boolean">
	import type { If } from '@/utils/types';

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
	export let expand: Expand = false as Expand;
	expand;

	export let exclude: RecordIdString[] = [];
	export let disabled = false;
	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	export let onSelect: (record: ExpandableResponse<C, Expand>) => void;
	export let presenter: RecordPresenter<ExpandableResponse<C, Expand>> =
		defaultRecordPresenter(collection);

	//

	function createSearchFunction(): SearchFunction<ExpandableResponse<C, Expand>> {
		return async (text: string | undefined) => {
			const options: RecordFullListOptions = {
				requestKey: null
			};
			if (exclude.length > 0) options.filter = excludeIdsFilter(exclude);
			if (text) options.filter = mergeFilters(options.filter, searchTextFilter(collection, text));

			const records = await pb
				.collection(collection)
				.getFullList<ExpandableResponse<C, Expand>>(options);

			return records.map((item) => {
				const presentation = presenter(item);
				return {
					value: item,
					label: typeof presentation == 'string' ? presentation : presentation.label,
					description: typeof presentation == 'object' ? presentation.description : undefined,
					disabled: false
				};
			});
		};
	}

	//

	// function typeCaster(value: unknown): CollectionRecords[C] {
	// 	return value as CollectionRecords[C];
	// }
</script>

<Search searchFn={createSearchFunction()} {onSelect} {label} {placeholder} {disabled}>
	<!-- <svelte:fragment slot="item" let:item>
			<slot name="item" item={typeCaster(item)}></slot>
	</svelte:fragment> -->
</Search>
