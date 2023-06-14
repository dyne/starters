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
	import { getCollectionSchema } from './getCollectionSchema';
	import TrashCan from '$lib/components/icons/trashCan.svelte';
	import Edit from '$lib/components/icons/edit.svelte';

	//

	export let collection: Collections;
	export let displayFields: string[] = ['id'];
	export let showDelete = true;
	export let showEdit = true;

	const recordService = pb.collection(collection);

	let dataPromise: Promise<Record[]>;
	loadData();

	async function loadData() {
		dataPromise = recordService.getFullList();
	}

	/* Record delete */

	let deletingRecord: Record | null = null;

	async function setDeletingRecord(record: Record) {
		deletingRecord = record;
	}

	function discardDelete() {
		deletingRecord = null;
	}

	async function deleteRecord() {
		if (deletingRecord) {
			await recordService.delete(deletingRecord.id);
			loadData();
			deletingRecord = null;
		}
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
										setDeletingRecord(item);
									}}
								>
									<TrashCan className="h-5" />
								</Button>
								<Button class="!p-3" color="alternative"><Edit className="h-5" /></Button>
							</TableBodyCell>
						{/if}
					</TableBodyRow>
				{/each}
			{/await}
		</TableBody>
	</Table>
</div>

<Modal open={Boolean(deletingRecord)} title="Delete record" size="xs" autoclose>
	<div class="text-center space-y-6">
		<P>Are you sure you want to delete this record?</P>
		<div class="flex gap-2 justify-center">
			<Button color="red" on:click={deleteRecord}>Delete</Button>
			<Button color="alternative" on:click={discardDelete}>Cancel</Button>
		</div>
	</div>
</Modal>
