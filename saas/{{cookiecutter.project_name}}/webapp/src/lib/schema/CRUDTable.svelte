<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { Record as PBRecord } from 'pocketbase';
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

	let dataPromise: Promise<PBRecord[]>;

	onMount(() => {
		loadData();
	});

	async function loadData() {
		dataPromise = recordService.getFullList();
	}

	/* Record actions */

	type Action = 'delete' | 'edit' | 'create';

	let currentRecord: PBRecord | null = null;
	let currentAction: Action | null = null;

	async function setAction(action: Action, record: PBRecord | null = null) {
		currentAction = action;
		currentRecord = record;
	}

	function resetState() {
		currentRecord = null;
		currentAction = null;
	}

	async function deleteRecord() {
		if (currentRecord && currentAction === 'delete') {
			await recordService.delete(currentRecord.id);
			loadData();
			resetState();
		}
	}

	async function handleSuccess() {
		loadData();
		resetState();
	}
</script>

<div>
	<div class="flex justify-between items-center mb-4">
		<Heading tag="h4">{collection}</Heading>
		<div class="shrink-0">
			<Button
				color="alternative"
				on:click={() => {
					setAction('create');
				}}
			>
				+ Add entry
			</Button>
		</div>
	</div>
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
											setAction('edit', item);
										}}
									>
										<Edit className="h-5" />
									</Button>
									<Button
										class="!p-3"
										color="alternative"
										on:click={() => {
											setAction('delete', item);
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

<div class="flex flex-col">
	<p>{JSON.stringify(currentAction)}</p>
	<p>{JSON.stringify(currentRecord)}</p>
</div>

{#if Boolean(currentRecord)}
	<Modal open={currentAction === 'delete'} title="Delete record" size="xs" on:hide={resetState}>
		<div class="text-center space-y-6">
			<P>Are you sure you want to delete this record?</P>
			<div class="flex gap-2 justify-center">
				<Button color="red" on:click={deleteRecord}>Delete</Button>
				<Button color="alternative" on:click={resetState}>Cancel</Button>
			</div>
		</div>
	</Modal>

	<Modal open={currentAction === 'edit'} title="Edit record" size="lg" on:hide={resetState}>
		<div class="w-[500px]">
			<slot name="editForm" {currentRecord}>
				<CrudForm {collection} initialData={currentRecord} on:success={handleSuccess} />
			</slot>
		</div>
	</Modal>
{/if}

<Modal open={currentAction === 'create'} title="Create record" size="lg" on:hide={resetState}>
	<div class="w-[500px]">
		<slot name="createForm">
			<CrudForm {collection} on:success={handleSuccess} />
		</slot>
	</div>
</Modal>
