<script lang="ts" context="module">
	import type { CollectionFormOptions, FieldsOptions } from '../form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import { getContext } from 'svelte';
	import type { RecordService } from 'pocketbase';
	import type { RecordFullListOptions, RecordListOptions } from 'pocketbase';
	import CollectionManagerPagination from './collectionManagerPagination.svelte';

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
		// 	perPage: Writable<number>;
		// 	currentPage: Writable<string>;
		// 	totalPages: Writable<number>;
		// 	totalItems: Writable<number>;
		// 	queryParams: Writable<RecordFullListOptions>;
		// };
		pagination: {
			perPage: number | false;
		};
		selection: {
			selectedRecords: Writable<RecordIdString[]>;
			areAllRecordsSelected: (selectedRecords: RecordIdString[]) => boolean;
			toggleSelectAllRecords: () => void;
			discardSelection: () => void;
		};
		formsOptions: {
			base: CollectionFormOptions;
			create: CollectionFormOptions;
			edit: CollectionFormOptions;
		};
		formFieldsOptions: {
			base: Partial<FieldsOptions<C>>;
			create: Partial<FieldsOptions<C>>;
			edit: Partial<FieldsOptions<C>>;
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
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { pb, setupComponentPbSubscriptions } from '@/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import EmptyState from '@/components/custom/emptyState.svelte';
	import type { RecordIdString } from '@/pocketbase/types';

	//

	export let collection: C;

	//

	export let formOptions: CollectionFormOptions = {};
	export let createFormOptions: CollectionFormOptions = {};
	export let editFormOptions: CollectionFormOptions = {};

	export let formFieldsOptions: Partial<FieldsOptions<C>> = {};
	export let createFormFieldsOptions: Partial<FieldsOptions<C>> = {};
	export let editFormFieldsOptions: Partial<FieldsOptions<C>> = {};

	//

	export let subscribe: CollectionName[] = [];
	export let expand: Expand | undefined = undefined;
	export let inverseExpand: InverseExpand | undefined = undefined;

	export let filter: string | undefined = undefined;
	export let sort: string | undefined = '-created';

	export let perPage: number | false = false;

	export let hide: ('emptyState' | 'pagination')[] = [];
	// export let hideEmptyState = false;

	// export let initialQueryParams: RecordFullListOptions = {};

	// export let perPage = 25;
	// export let disablePagination = false;

	/* Data load */

	const fetchOptions = writable<FetchOptions>({});
	$: $fetchOptions = createFetchOptions(filter, sort, expand, perPage, $page);

	function createFetchOptions(
		f: typeof filter,
		s: typeof sort,
		e: typeof expand,
		p: typeof perPage,
		page: Page
	): FetchOptions {
		inverseExpand; // TODO: use here
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

	let recordService = pb.collection(collection);

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
			records = await recordService.getFullList<T>({ requestKey: null, ...fetchOptions });
		} catch (e) {
			error = e as ClientResponseError;
		}
	}

	/* Subscriptions */

	// TODO - Link subscribe to expand
	// TODO - When "authorizations" is added, `records` update, but not when it's removed
	const subscriptionCollections: CollectionName[] = [...subscribe, collection, 'authorizations'];
	for (const c of Array.dedupe(subscriptionCollections)) {
		setupComponentPbSubscriptions(c, () => loadRecords($fetchOptions));
	}

	/* Record selection */

	const selectedRecords = writable<string[]>([]);

	function areAllRecordsSelected(selectedRecords: RecordIdString[]) {
		return records.every((r) => selectedRecords.includes(r.id));
	}

	function toggleSelectAllRecords() {
		const allSelected = areAllRecordsSelected($selectedRecords);
		if (allSelected) {
			$selectedRecords = [];
		} else {
			$selectedRecords = records.map((item) => item.id);
		}
	}

	function discardSelection() {
		$selectedRecords = [];
	}

	function isRecordSelected(recordId: RecordIdString) {
		return $selectedRecords.includes(recordId);
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
		pagination: { perPage },
		selection: {
			selectedRecords,
			areAllRecordsSelected,
			toggleSelectAllRecords,
			discardSelection
		},
		formsOptions: {
			base: formOptions,
			create: createFormOptions,
			edit: editFormOptions
		},
		formFieldsOptions: {
			base: formFieldsOptions,
			create: createFormFieldsOptions,
			edit: editFormFieldsOptions
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
	<slot {records} selectedRecords={$selectedRecords} Pagination={CollectionManagerPagination} />

	{#if !hide.includes('pagination')}
		<div class="mt-6">
			<CollectionManagerPagination />
		</div>
	{/if}
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
