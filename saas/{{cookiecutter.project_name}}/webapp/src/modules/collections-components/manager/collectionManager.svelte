<script lang="ts" context="module">
	import type { PartialCollectionFormOptions } from '../form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import { getContext } from 'svelte';
	import type { RecordService } from 'pocketbase';
	import type { RecordFullListOptions, RecordListOptions } from 'pocketbase';

	//

	const PAGE_PARAM = 'page';

	type FetchOptions = RecordFullListOptions | RecordListOptions;

	// type PaginationData = {
	// 	currentPage: number
	// 	totalPages:number
	// 	totalItems:number
	// }

	export type RecordsManagerContext<C extends CollectionName> = {
		collection: CollectionName;
		recordService: RecordService;
		// fetchOptions: FetchOptions & {
		// 	PAGE_PARAM: string;
		// };
		// paginationData: Writable<PaginationData>
		// dataManager: {
		// 	loadRecords: () => Promise<void>;
		// 	perPage: Writable<number>;
		// 	currentPage: Writable<string>;
		// 	totalPages: Writable<number>;
		// 	totalItems: Writable<number>;
		// 	queryParams: Writable<RecordFullListOptions>;
		// };
		// selection: {
		// 	records: Writable<string[]>;
		// 	allRecordsSelected: (selectedRecords: string[]) => boolean;
		// 	toggleSelectAllRecords: () => void;
		// 	discardSelection: () => void;
		// };
		formsOptions: {
			base: PartialCollectionFormOptions<C>;
			create: PartialCollectionFormOptions<C>;
			edit: PartialCollectionFormOptions<C>;
		};
	};

	const RECORDS_MANAGER_KEY = Symbol('rmk');

	export function getRecordsManagerContext<C extends CollectionName>(): RecordsManagerContext<C> {
		return getContext(RECORDS_MANAGER_KEY);
	}

	import type { InverseExpandProp, ExpandProp, ExpandableResponse } from '../types';
</script>

<script
	lang="ts"
	generics="C extends CollectionName, Expand extends ExpandProp<C> = never, InverseExpand extends InverseExpandProp = never"
>
	import { FolderIcon } from 'lucide-svelte';

	import type { SimplifyDeep } from 'type-fest/source/simplify-deep';
	import { Array } from 'effect';
	import MessageCircleWarning from 'lucide-svelte/icons/message-circle-warning';
	import { m } from '$lib/i18n';
	import type { Page } from '@sveltejs/kit';
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { pb } from '@/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import EmptyState from '@/components/custom/emptyState.svelte';

	//

	export let collection: C;

	//

	export let formOptions: PartialCollectionFormOptions<C> = {};
	export let createFormOptions: PartialCollectionFormOptions<C> = {};
	export let editFormOptions: PartialCollectionFormOptions<C> = {};

	//

	export let subscribe: CollectionName[] = [];
	export let expand: Expand | undefined = undefined;
	export let inverseExpand: InverseExpand | undefined = undefined;
	inverseExpand;

	export let filter: string | undefined = undefined;
	export let sort: string | undefined = '-created';
	export let paginate: number | false = false;

	export let hide: ('emptyState' | 'pagination')[] = [];
	// export let hideEmptyState = false;

	// export let initialQueryParams: RecordFullListOptions = {};

	// export let perPage = 25;
	// export let disablePagination = false;

	/* Data load */

	const fetchOptions = writable<FetchOptions>({ requestKey: null });
	$: $fetchOptions = createFetchOptions(filter, sort, expand, paginate, $page);

	function createFetchOptions(
		f: typeof filter,
		s: typeof sort,
		e: typeof expand,
		p: typeof paginate,
		page: Page
	): FetchOptions {
		const options: typeof $fetchOptions = {};
		if (f) options.filter = f;
		if (s) options.sort = s;
		// if (typeof p == 'number') {
		// 	options.perPage = p;
		// 	const pageNumber = Number(page.url.searchParams.get(PAGE_PARAM));
		// 	options.page = Boolean(pageNumber) ? pageNumber : 1;
		// }
		if (e && e.length > 0) options.expand = e.join(', ');
		return options;
	}

	//

	$: recordService = pb.collection(collection);

	type T = SimplifyDeep<ExpandableResponse<C, Expand, InverseExpand>>;

	let records: T[] = [];

	let error: ClientResponseError | undefined = undefined;

	// let totalPages = writable(0);
	$: loadRecords($fetchOptions);
	async function loadRecords(fetchOptions: FetchOptions) {
		// if (paginate) {
		// 	const res = await recordService.getList<ExpandableResponse<C, Expand>[]>(Number($currentPage), $fetchOptions.perPage, {
		// 		...$fetchOptions
		// 	});
		// 	records = res.items;
		// 	totalPages.set(res.totalPages);
		// 	totalItems.set(res.totalItems);
		// } else {
		// 	const res = await recordService.getFullList<RecordGeneric>({
		// 		...$fetchOptions
		// 	});
		// 	records = res;
		// }
		try {
			records = await recordService.getFullList<T>(fetchOptions);
		} catch (e) {
			error = e as ClientResponseError;
		}
	}

	onMount(() => {
		const collections = Array.dedupe([...subscribe, collection]);
		collections.forEach((c) => pb.collection(c).subscribe('*', () => loadRecords($fetchOptions)));
		return () => collections.forEach((c) => pb.collection(c).unsubscribe());
	});

	/* Record selection */

	const selectedRecords = writable<string[]>([]);

	function allRecordsSelected(selectedRecords: string[] = []) {
		return records.every((r) => selectedRecords.includes(r.id));
	}

	function toggleSelectAllRecords() {
		const allSelected = allRecordsSelected($selectedRecords);
		if (allSelected) {
			$selectedRecords = [];
		} else {
			$selectedRecords = records.map((item) => item.id);
		}
	}

	function discardSelection() {
		$selectedRecords = [];
	}

	/* Context */

	setContext<RecordsManagerContext<C>>(RECORDS_MANAGER_KEY, {
		collection,
		recordService,
		// dataManager: {
		// 	recordService,
		// 	loadRecords,
		// 	queryParams: fetchOptions,
		// 	perPage: writable(perPage),
		// 	currentPage,
		// 	totalPages,
		// 	totalItems
		// },
		// selectionManager: {
		// 	selectedRecords,
		// 	allRecordsSelected,
		// 	toggleSelectAllRecords,
		// 	discardSelection
		// },
		formsOptions: {
			base: formOptions,
			create: createFormOptions,
			edit: editFormOptions
		}
	});
</script>

{#if error}
	<EmptyState
		title={m.Error()}
		description={m.Some_error_occurred_while_loading_records_()}
		icon={MessageCircleWarning}
	/>
{:else if records.length > 0}
	<slot {records} />
{:else}
	<slot name="emptyState">
		{#if !hide.includes('emptyState')}
			<EmptyState
				title={m.No_items_here()}
				description={m.Start_by_adding_a_record_to_this_collection_()}
				icon={FolderIcon}
			/>
		{/if}
	</slot>
{/if}
