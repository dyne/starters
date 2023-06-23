<script lang="ts" context="module">
	import type { Record as PBRecord, RecordService } from 'pocketbase';
	import type { SvelteComponent } from 'svelte';
	import { getContext, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	//

	export type ManagerAction = {
		name: string;
		function: <T>(record: T & PBRecord) => Promise<void> | void;
		icon?: typeof SvelteComponent;
	};

	//

	export const RECORDS_MANAGER_KEY = Symbol('rmk');

	export type RecordsManagerContext = {
		recordService: RecordService;
		loadRecords: () => void;
		selectedRecords: Writable<string[]>;
		formRelationsDisplayFields: RelationsDisplayFields;
		formHiddenFields: string[];
		formHiddenFieldsValues: Record<string, unknown>;
	};

	export function getRecordsManagerContext(): RecordsManagerContext {
		return getContext(RECORDS_MANAGER_KEY);
	}
</script>

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { RecordFullListQueryParams } from 'pocketbase';
	import type { Collections } from '$lib/pocketbase-types';
	import { Button, Heading, Modal, P } from 'flowbite-svelte';
	// import CrudForm, {
	// 	formMode,
	// 	type FormMode,
	// 	type RelationsDisplayFields
	// } from '../CRUDForm.svelte';
	import type { RelationsDisplayFields } from '../CRUDForm.svelte';
	import { writable } from 'svelte/store';

	//

	export let collection: Collections;

	export let formRelationsDisplayFields: RecordsManagerContext['formRelationsDisplayFields'] = {};
	export let formHiddenFields: RecordsManagerContext['formHiddenFields'] = [];
	export let formHiddenFieldsValues: RecordsManagerContext['formHiddenFieldsValues'] = {};

	/* Data load */

	const recordService = pb.collection(collection);

	let records: PBRecord[];
	let queryParams: RecordFullListQueryParams = {
		$autoCancel: false,
		sort: '-created'
	};

	async function loadRecords() {
		records = await recordService.getFullList(queryParams);
	}

	$: {
		queryParams;
		loadRecords();
	}

	/* Record actions */

	const selectedRecords = writable<string[]>([]);

	// /* Multiple selection */

	// let allSelected = false;

	// $: if (data) {
	// 	allSelected = data.length === selection.length;
	// }

	function areAllRecordsSelected() {
		return records.every((r) => $selectedRecords.includes(r.id));
	}

	function toggleAllRecordsSelection() {
		const allSelected = areAllRecordsSelected();
		if (allSelected) {
			$selectedRecords = [];
		} else {
			if (records) {
				$selectedRecords = records.map((item) => item.id);
			}
		}
	}

	// function discardSelection() {
	// 	selection = [];
	// }

	// async function deleteSelection() {
	// 	if (selection.length && selectedAction === 'delete') {
	// 		for (const id of selection) {
	// 			await recordService.delete(id);
	// 		}
	// 		loadData();
	// 		discardSelection();
	// 		resetState();
	// 	}
	// }

	/* Context */

	setContext<RecordsManagerContext>(RECORDS_MANAGER_KEY, {
		recordService,
		loadRecords,
		selectedRecords,
		formRelationsDisplayFields,
		formHiddenFields,
		formHiddenFieldsValues
	});
</script>

<div>
	<!-- <div class="flex justify-between items-center mb-4">
		<Heading tag="h4">{collection}</Heading>
		<div class="shrink-0 flex space-x-4 items-center">
			{#if Boolean(selection.length)}
				<P><span class="font-bold">{selection.length}</span> selected</P>
				<div class="flex space-x-2 items-center">
					<Button color="alternative" on:click={discardSelection}>
						<XMark size="20" />
						<span class="ml-1">Discard</span>
					</Button>
					<Button
						color="alternative"
						on:click={() => {
							setAction('delete');
						}}
					>
						<Trash size="20" />
						<span class="ml-1">Delete</span>
					</Button>
				</div>
			{:else}
				<Button
					color="alternative"
					on:click={() => {
						setAction(formMode.CREATE);
					}}
				>
					<Plus size="20" />
					<span class="ml-1">Add entry</span>
				</Button>
			{/if}
		</div>
	</div> -->

	{#if records && records.length}
		<div>
			{#each records as record (record.id)}
				{@const isRecordSelected = $selectedRecords.includes(record.id)}
				<slot {record} {isRecordSelected} {loadRecords} />
			{/each}
		</div>
	{/if}
</div>

<!-- {#if Boolean(selection.length)}
	<Modal open={selectedAction === 'delete'} title="Delete record" size="xs" on:hide={resetState}>
		<div class="text-center space-y-6">
			<P>
				Are you sure you want to delete <span class="font-bold">{selection.length}</span> records?
			</P>
			<div class="flex gap-2 justify-center">
				<Button color="red" on:click={deleteSelection}>Delete</Button>
				<Button color="alternative" on:click={resetState}>Cancel</Button>
			</div>
		</div>
	</Modal>
{/if} -->
