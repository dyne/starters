<script lang="ts" generics="C extends CollectionName, Expand extends ExpandQueryOption<C> = never">
	import {
		type PocketbaseQueryOptions,
		type ExpandQueryOption,
		type QueryResponse,
		PocketbaseQuery
	} from '@/pocketbase/query';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import { createRecordDisplay } from './utils';
	import Search from '@/components/custom/search.svelte';
	import type { SearchFunction } from '@/components/custom/search.svelte';
	import type { CollectionRecords } from '@/pocketbase/types';
	import type { RecordPresenter } from './utils';

	




	interface Props {
		//
		collection: C;
		queryOptions?: Partial<PocketbaseQueryOptions<C, Expand>>;
		disabled?: boolean;
		label?: string | undefined;
		placeholder?: string | undefined;
		onSelect?: (record: QueryResponse<C, Expand>) => void;
		displayFields?: (keyof CollectionRecords[C])[] | undefined;
		displayFn?: RecordPresenter<QueryResponse<C, Expand>> | undefined;
	}

	let {
		collection,
		queryOptions = {},
		disabled = false,
		label = undefined,
		placeholder = undefined,
		onSelect = () => {},
		displayFields = undefined,
		displayFn = undefined
	}: Props = $props();


	function createSearchFunction(
		pocketbaseQuery: PocketbaseQuery<C, Expand>
	): SearchFunction<QueryResponse<C, Expand>> {
		return async (text: string | undefined) => {
			pocketbaseQuery.options.search = text;
			const records = await pocketbaseQuery.getFullList();

			return records.map((item) => ({
				value: item,
				label: createRecordDisplay(item, displayFields, displayFn),
				disabled: false
			}));
		};
	}

	//

	// function typeCaster(value: unknown): CollectionRecords[C] {
	// 	return value as CollectionRecords[C];
	// }
	//

	let pocketbaseQuery = $derived(new PocketbaseQuery(collection, queryOptions));
	let searchFunction = $derived(createSearchFunction(pocketbaseQuery));
</script>

<Search searchFn={searchFunction} {onSelect} {label} {placeholder} {disabled} />

<!-- <svelte:fragment slot="item" let:item>
		<slot name="item" item={typeCaster(item)}></slot>
</svelte:fragment> -->
