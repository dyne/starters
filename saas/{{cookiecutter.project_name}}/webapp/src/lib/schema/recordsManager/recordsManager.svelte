<script lang="ts" context="module">
	import type { Record as PBRecord, RecordService } from 'pocketbase';
	import { getContext, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { FormSettings } from '../CRUDForm.svelte';

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
	import { browser } from '$app/environment';

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

	const queryParams = writable<RecordFullListQueryParams>({
		sort: '-created'
	});

	$: $queryParams = {
		$autoCancel: false,
		...$queryParams,
		...initialQueryParams
	};

	const recordService = pb.collection(collection);

	let records: (RecordGeneric & PBRecord)[] = [];

	async function loadRecords() {
		records = await recordService.getFullList($queryParams);
	}

	$: if (browser) {
		$queryParams;
		loadRecords();
	}

	onMount(() => {
		const collections = [...subscribe, collection];
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
