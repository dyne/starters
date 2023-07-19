<script lang="ts" context="module">
	import type { Record as PBRecord, RecordService } from 'pocketbase';
	import { getContext, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { FormSettings } from '../CRUDForm.svelte';
	import { Pagination } from 'flowbite-svelte';

	//

	export const RECORDS_MANAGER_KEY = Symbol('rmk');

	export type RecordsManagerContext = {
		collection: string;
		dataManager: {
			recordService: RecordService;
			loadRecords: () => Promise<void>;
			queryParams: Writable<RecordFullListQueryParams>;
		};
		selectionManager: {
			selectedRecords: Writable<string[]>;
			allRecordsSelected: (selectedRecords: string[]) => boolean;
			toggleSelectAllRecords: () => void;
			discardSelection: () => void;
		};
		formSettings: Partial<FormSettings>;
		editFormSettings: Partial<FormSettings>;
	};

	export function getRecordsManagerContext(): RecordsManagerContext {
		return getContext(RECORDS_MANAGER_KEY);
	}

	//

	type SlotTypeCaster<RecordGeneric> = RecordGeneric[];
	export function createSlotTypeCaster<RecordGeneric>(): SlotTypeCaster<RecordGeneric> {
		return [];
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import { pb } from '$lib/pocketbase';
	import type { RecordFullListQueryParams } from 'pocketbase';
	import type { Collections } from '$lib/pocketbase-types';
	import { writable } from 'svelte/store';

	//

	export let collection: Collections | string;
	export let formSettings: Partial<FormSettings> = {};
	export let editFormSettings: Partial<FormSettings> = {};
	export let initialQueryParams: RecordFullListQueryParams = {};
	export let subscribe: string[] = [];

	/* Slot typing */

	type RecordGeneric = $$Generic;
	export let slotTypeCaster = createSlotTypeCaster<RecordGeneric>();
	slotTypeCaster; // avoid 'unused' warning

	/* Data load */

	$: pages = Array.from({ length: totalPages }, (_, i) => ({
		name: `${i + 1}`,
		href: `?page=${i + 1}`
	}));
	let currentPage = '';
	$: currentPage = $page.url.searchParams.get('page') || '1';
	const queryParams = writable<RecordFullListQueryParams>({
		sort: '-created'
	});

	$: $queryParams = {
		$autoCancel: false,
		...$queryParams,
		...initialQueryParams
	};

	const recordService = pb.collection(collection);

	let records: PBRecord[] = [];
	let totalPages: number;

	async function loadRecords() {
		const res = await recordService.getList(Number(currentPage), 2, { ...$queryParams });
		records = res.items;
		totalPages = res.totalPages;

		console.log('records', res);
	}

	$: if (browser) {
		$queryParams = {
			...$queryParams,
			page: Number($page.url.searchParams.get('page') || 0)
		};
		loadRecords();
	}

	onMount(() => {
		const collections = [...subscribe, collection];
		console.log($page.url.searchParams.get('page'));
		console.log($page.url.searchParams.toString());
		for (const c of collections) {
			pb.collection(c).subscribe('*', () => {
				loadRecords();
			});
		}

		return () => {
			for (const c of collections) {
				pb.collection(c).unsubscribe();
			}
		};
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

	setContext<RecordsManagerContext>(RECORDS_MANAGER_KEY, {
		collection,
		dataManager: {
			recordService,
			loadRecords,
			queryParams
		},
		selectionManager: {
			selectedRecords,
			allRecordsSelected,
			toggleSelectAllRecords,
			discardSelection
		},
		formSettings,
		editFormSettings
	});
</script>

<slot {records} {loadRecords} />
<slot name="pagination">
	{#if records.length > 0}
		<div class="flex w-full justify-center my-5">
			<Pagination
				{pages}
				on:previous={(e) => {
					e.preventDefault();
					goto(`?page=${Number(currentPage) - 1}`);
				}}
				on:next={(e) => {
					e.preventDefault();
					goto(`?page=${Number(currentPage) + 1}`);
				}}
				on:click={(e) => {
					e.preventDefault();
					goto(e.target?.href);
				}}
			/>
		</div>
	{/if}
</slot>
