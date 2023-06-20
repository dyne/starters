<script lang="ts" context="module">
	import type { Record as PBRecord } from 'pocketbase';
	import type { SvelteComponent } from 'svelte';

	export type TableAction = {
		name: string;
		icon?: typeof SvelteComponent;
		function: <T>(record: T & PBRecord) => void;
	};
</script>

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { RecordFullListQueryParams } from 'pocketbase';
	import type { Collections } from '$lib/pocketbase-types';
	import {
		Button,
		Heading,
		Modal,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';
	import CrudForm, { type RelationsDisplayFields } from './CRUDForm.svelte';
	import CrudTableHead from './CRUDTableHead.svelte';
	import { Trash, Pencil, Plus, XMark } from 'svelte-heros-v2';

	//

	export let collection: Collections;
	export let displayFields: string[] = ['id'];
	export let showDelete = true;
	export let showEdit = true;
	export let actions: Array<TableAction> = [];
	export let relationsDisplayFields: RelationsDisplayFields = {};

	const recordService = pb.collection(collection);

	let data: PBRecord[];
	let queryParams: RecordFullListQueryParams = {
		$autoCancel: false,
		sort: '-created'
	};

	async function loadData() {
		data = await recordService.getFullList(queryParams);
	}

	$: {
		queryParams;
		loadData();
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

	/* Multiple selection */

	let selection: string[] = [];
	let allSelected = false;

	$: if (data) {
		allSelected = data.length === selection.length;
	}

	function toggleAll() {
		if (allSelected) {
			selection = [];
		} else {
			if (data) {
				selection = data.map((item) => item.id);
			}
		}
	}

	function discardSelection() {
		selection = [];
	}

	async function deleteSelection() {
		if (selection.length && currentAction === 'delete') {
			for (const id of selection) {
				await recordService.delete(id);
			}
			loadData();
			discardSelection();
			resetState();
		}
	}
</script>

<div>
	<div class="flex justify-between items-center mb-4">
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
						<span class="ml-1"> Delete </span>
					</Button>
				</div>
			{:else}
				<Button
					color="alternative"
					on:click={() => {
						setAction('create');
					}}
				>
					<Plus size="20" />
					<span class="ml-1"> Add entry </span>
				</Button>
			{/if}
		</div>
	</div>
	<Table>
		<TableHead>
			<TableHeadCell><Checkbox checked={allSelected} on:click={toggleAll} /></TableHeadCell>
			{#each displayFields as field}
				<CrudTableHead bind:queryParams {field} />
			{/each}
			{#if showEdit || showDelete}
				<TableHeadCell>Actions</TableHeadCell>
			{/if}
		</TableHead>
		<TableBody>
			{#if data}
				{#each data as item (item.id)}
					<TableBodyRow>
						<TableBodyCell>
							<Checkbox bind:group={selection} value={item.id} name="select" />
						</TableBodyCell>
						{#each displayFields as field}
							<TableBodyCell>{item[field]}</TableBodyCell>
						{/each}
						{#if showEdit || showDelete}
							<TableBodyCell>
								<div class="flex items-center space-x-2">
									<Button
										class="!px-3"
										color="alternative"
										on:click={() => {
											setAction('edit', item);
										}}
									>
										<Pencil size="20" />
									</Button>
									<Button
										class="!px-3"
										color="alternative"
										on:click={() => {
											setAction('delete', item);
										}}
									>
										<Trash size="20" />
									</Button>
									{#each actions as action}
										<Button
											class="!px-3"
											color="alternative"
											on:click={() => {
												action.function(item);
											}}
										>
											{#if action.icon}
												<svelte:component this={action.icon} />
											{:else}
												{action.name}
											{/if}
										</Button>
									{/each}
								</div>
							</TableBodyCell>
						{/if}
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>

{#if Boolean(currentRecord)}
	<Modal open={currentAction === 'delete'} title="Delete record" size="xs" on:hide={resetState}>
		<div class="text-center space-y-6">
			<P>Are you sure you want to delete this record?</P>
			<div class="flex gap-2 justify-center">
				<Button color="red" on:click={deleteRecord}>
					<Trash size="20" /><span class="ml-1">Delete</span>
				</Button>
				<Button color="alternative" on:click={resetState}>
					<XMark size="20" />
					<span class="ml-1"> Cancel </span>
				</Button>
			</div>
		</div>
	</Modal>

	<Modal open={currentAction === 'edit'} title="Edit record" size="lg" on:hide={resetState}>
		<div class="w-[500px]">
			<slot name="editForm" {currentRecord}>
				<CrudForm
					{collection}
					initialData={currentRecord}
					{relationsDisplayFields}
					on:success={handleSuccess}
				/>
			</slot>
		</div>
	</Modal>
{/if}

<Modal open={currentAction === 'create'} title="Create record" size="lg" on:hide={resetState}>
	<div class="w-[500px]">
		<slot name="createForm">
			<CrudForm {collection} on:success={handleSuccess} {relationsDisplayFields} />
		</slot>
	</div>
</Modal>

{#if Boolean(selection.length)}
	<Modal open={currentAction === 'delete'} title="Delete record" size="xs" on:hide={resetState}>
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
{/if}
