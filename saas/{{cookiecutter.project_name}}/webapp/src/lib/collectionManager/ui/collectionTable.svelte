<script lang="ts">
	import { ShareRecord, SelectRecord, EditRecord, DeleteRecord } from './recordActions';
	import { Clock } from 'svelte-heros-v2';
	import EmptyState from './collectionEmptyState.svelte';
	import FieldComponent, {
		type FieldsComponents
	} from './fieldComponents/fieldComponentRenderer.svelte';
	import { getRecordsManagerContext } from '../collectionManager.svelte';

	// Components
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';
	import type { SvelteComponent } from 'svelte';
	import RecordsTableHead from './collectionTableHeader.svelte';
	import type { PBRecord, PBResponse, PBResponseKeys } from '$lib/utils/types';

	//

	type RecordGeneric = $$Generic<PBRecord>;
	type Keys<T extends PBRecord> = PBResponseKeys<PBResponse<T>>;

	export let records: PBResponse<RecordGeneric>[] = [];
	export let fields: Keys<RecordGeneric>[] = ['id'];
	export let fieldsComponents: FieldsComponents<RecordGeneric> = {};
	export let fieldsLabels: Partial<Record<Keys<RecordGeneric>, string>> = {};

	export let showShare: boolean = false;
	export let showDelete = true;
	export let showEdit = true;
	export let showCheckboxes = true;

	const { selectionManager } = getRecordsManagerContext();
	const { allRecordsSelected, toggleSelectAllRecords, selectedRecords } = selectionManager;

	$: selectAll = allRecordsSelected($selectedRecords);
	$: hasActions = showEdit || showDelete || Boolean($$slots.default);
</script>

{#if records.length === 0}
	<slot name="emptyState">
		<EmptyState />
	</slot>
{:else}
	<Table>
		<TableHead>
			{#if showCheckboxes}
				<TableHeadCell>
					<Checkbox checked={selectAll} on:click={toggleSelectAllRecords} />
				</TableHeadCell>
			{/if}
			{#each fields as field}
				{@const label = fieldsLabels[field] ?? field}
				<RecordsTableHead field={label} />
			{/each}
			{#if hasActions}
				<TableHeadCell>Actions</TableHeadCell>
			{/if}
		</TableHead>
		<TableBody>
			{#each records as record (record.id)}
				<TableBodyRow>
					{#if showCheckboxes}
						<TableBodyCell>
							<SelectRecord {record} />
						</TableBodyCell>
					{/if}
					{#each fields as field}
						<TableBodyCell>
							{@const component = fieldsComponents[field]}
							<FieldComponent {record} {field} {component} />
						</TableBodyCell>
					{/each}
					{#if hasActions}
						<TableBodyCell>
							<div class="flex items-center space-x-2">
								{#if showEdit}
									<EditRecord {record} />
								{/if}
								{#if showDelete}
									<DeleteRecord {record} />
								{/if}
								{#if showShare}
									<ShareRecord {record} />
								{/if}
								<slot {record} />
							</div>
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
