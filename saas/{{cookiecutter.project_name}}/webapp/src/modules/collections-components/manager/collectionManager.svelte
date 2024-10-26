<script lang="ts" context="module">
	import type { CollectionFormOptions, FieldsOptions } from '../form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import { getContext } from 'svelte';
	import type { RecordService } from 'pocketbase';
	import type { RecordFullListOptions, RecordListOptions } from 'pocketbase';
	import CollectionManagerPagination from './collectionManagerPagination.svelte';

	//

	type FetchOptions<
		C extends CollectionName,
		Expand extends ExpandProp<C> = never,
		InverseExpand extends InverseExpandProp = never
	> = {
		subscribe: CollectionName[];
		expand: Expand;
		inverseExpand: InverseExpand;
		filter: string;
		sort: string;
		perPage: number | false;
	};

	type PaginationContext = {
		currentPage: Writable<number | undefined>;
		totalItems: Writable<number | undefined>;
	};

	export type RecordsManagerContext<
		C extends CollectionName,
		Expand extends ExpandProp<C> = never,
		InverseExpand extends InverseExpandProp = never
	> = {
		collection: CollectionName;
		recordService: RecordService;
		fetchOptions: Writable<Partial<FetchOptions<C, Expand, InverseExpand>>>;
		paginationContext: PaginationContext;
		selectionContext: {
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
	import { ensureArray } from '@/utils/other';
	import { FolderIcon } from 'lucide-svelte';
	import type { SimplifyDeep } from 'type-fest/source/simplify-deep';
	import MessageCircleWarning from 'lucide-svelte/icons/message-circle-warning';
	import { m } from '$lib/i18n';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { pb, setupComponentPbSubscriptions } from '@/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import EmptyState from '@/components/custom/emptyState.svelte';
	import type { RecordIdString } from '@/pocketbase/types';
	import { Array as A } from 'effect';

	//

	export let collection: C;

	export let formOptions: CollectionFormOptions = {};
	export let createFormOptions: CollectionFormOptions = {};
	export let editFormOptions: CollectionFormOptions = {};

	export let formFieldsOptions: Partial<FieldsOptions<C>> = {};
	export let createFormFieldsOptions: Partial<FieldsOptions<C>> = {};
	export let editFormFieldsOptions: Partial<FieldsOptions<C>> = {};

	export let hide: ('emptyState' | 'pagination')[] = [];

	export let fetchOptions: Partial<FetchOptions<C, Expand, InverseExpand>> = {};

	//

	const fetchOptionsStore = writable<typeof fetchOptions>(fetchOptions);
	$: $fetchOptionsStore = { ...$fetchOptionsStore, ...fetchOptions };

	const currentPage = writable<number | undefined>(undefined);
	const totalItems = writable<number | undefined>(undefined);

	let records: T[] = [];
	type T = SimplifyDeep<ExpandableResponse<C, Expand, InverseExpand>>;

	let error: ClientResponseError | undefined = undefined;

	let recordService = pb.collection(collection);

	$: loadRecords($fetchOptionsStore, $currentPage);

	async function loadRecords(
		fetchOptions: Partial<FetchOptions<C, Expand, InverseExpand>> = {},
		currentPage: number | undefined = undefined
	) {
		const { expand, filter, inverseExpand, sort, perPage } = fetchOptions;
		const options: RecordFullListOptions | RecordListOptions = {
			requestKey: null
		};
		if (expand) options.expand = expand.join(',');
		if (filter) options.filter = filter;
		if (sort) options.sort = fetchOptions.sort;
		if (inverseExpand) {
			const expand = Object.entries(inverseExpand)
				.map(([k, v]) => `${k}_via_${v}`)
				.join(',');
			if (options.expand) options.expand = options.expand + ',' + expand;
			else options.expand = expand;
		}

		try {
			if (perPage) {
				const result = await recordService.getList<T>(currentPage, perPage, options);
				totalItems.set(result.totalItems);
				records = result.items;
			} else {
				records = await recordService.getFullList<T>(options);
			}
		} catch (e) {
			error = e as ClientResponseError;
		}
	}

	/* Subscriptions */

	// TODO - Use `expand` field instead of `subscribe`
	// TODO - When "authorizations" is added, `records` update, but not when it's removed
	const subscriptionCollections: CollectionName[] = [
		...ensureArray($fetchOptionsStore.subscribe),
		collection,
		'authorizations'
	];
	for (const c of A.dedupe(subscriptionCollections)) {
		setupComponentPbSubscriptions(c, () => loadRecords($fetchOptionsStore, $currentPage));
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

	/* Context */

	setContext<RecordsManagerContext<C, Expand, InverseExpand>>(RECORDS_MANAGER_KEY, {
		collection,
		recordService,
		paginationContext: {
			currentPage,
			totalItems
		},
		fetchOptions: fetchOptionsStore,
		selectionContext: {
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
