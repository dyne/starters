<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { Record } from 'pocketbase';
	import type { Collections } from '$lib/pocketbase-types';
	import {
		Button,
		Heading,
		Modal,
		P,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import TrashCan from '$lib/components/icons/trashCan.svelte';
	import Edit from '$lib/components/icons/edit.svelte';
	import CrudForm from './CRUDForm.svelte';
	import { onMount } from 'svelte';

	//

	export let collection: Collections;
	export let displayFields: string[] = ['id'];
	export let showDelete = true;
	export let showEdit = true;

	const recordService = pb.collection(collection);

	let dataPromise: Promise<Record[]>;

	onMount(() => {
		loadData();
	});

	async function loadData() {
		dataPromise = recordService.getFullList();
	}

	/* Record actions */

	type Action = 'delete' | 'edit';

	let currentRecord: Record | null = null;
	let recordAction: Action | null = null;

	async function setRecordForAction(record: Record, action: Action) {
		currentRecord = record;
		recordAction = action;
	}

	function discard() {
		currentRecord = null;
		recordAction = null;
	}

	async function deleteRecord() {
		if (currentRecord && recordAction === 'delete') {
			await recordService.delete(currentRecord.id);
			loadData();
			discard();
		}
	}

	async function handleSuccess() {
		loadData();
		discard();
	}
</script>

<div>
	<Table>
		<TableHead>
			{#each displayFields as field}
				<TableHeadCell>{field}</TableHeadCell>
			{/each}
			{#if showEdit || showDelete}
				<TableHeadCell>Actions</TableHeadCell>
			{/if}
		</TableHead>
		<TableBody>
			{#if dataPromise}
				{#await dataPromise}
					<TableBodyRow>
						<Spinner />
					</TableBodyRow>
				{:then data}
					{#each data as item (item.id)}
						<TableBodyRow>
							{#each displayFields as field}
								<TableBodyCell>{item[field]}</TableBodyCell>
							{/each}
							{#if showEdit || showDelete}
								<TableBodyCell class="space-x-1">
									<Button
										class="!p-3"
										color="alternative"
										on:click={() => {
											setRecordForAction(item, 'edit');
										}}
									>
										<Edit className="h-5" />
									</Button>
									<Button
										class="!p-3"
										color="alternative"
										on:click={() => {
											setRecordForAction(item, 'delete');
										}}
									>
										<TrashCan className="h-5" />
									</Button>
								</TableBodyCell>
							{/if}
						</TableBodyRow>
					{/each}
				{/await}
			{/if}
		</TableBody>
	</Table>
</div>

<Modal open={Boolean(currentRecord) && recordAction === 'delete'} title="Delete record" size="xs">
	<div class="text-center space-y-6">
		<P>Are you sure you want to delete this record?</P>
		<div class="flex gap-2 justify-center">
			<Button color="red" on:click={deleteRecord}>Delete</Button>
			<Button color="alternative" on:click={discard}>Cancel</Button>
		</div>
	</div>
</Modal>

<Modal open={Boolean(currentRecord) && recordAction === 'edit'} title="Edit record" size="lg">
	<div class="w-[500px]">
		<CrudForm {collection} initialData={currentRecord} on:success={handleSuccess} />
	</div>
</Modal>
