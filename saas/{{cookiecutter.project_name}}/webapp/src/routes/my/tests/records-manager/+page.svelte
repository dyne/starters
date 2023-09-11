<script lang="ts">
	import TableSkeleton from '$lib/components/tableSkeleton.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord, type PostsRecord } from '$lib/pocketbase-types';
	import FilterRecords from '$lib/schema/recordsManager/filterRecords.svelte';
	import RecordsManager, {
		createSlotTypeCaster
	} from '$lib/schema/recordsManager/recordsManager.svelte';
	import RecordsManagerTopbar from '$lib/schema/recordsManager/recordsManagerTopbar.svelte';
	import EmptyState from '$lib/schema/recordsManager/views/emptyState.svelte';
	import Chip from '$lib/schema/recordsManager/views/fieldsComponents/cells/chip.svelte';
	import RecordCard from '$lib/schema/recordsManager/views/recordCard.svelte';
	import RecordsTable from '$lib/schema/recordsManager/views/recordsTable.svelte';
	import { CardPlaceholder, Heading, Hr } from 'flowbite-svelte';
	import { XCircle } from 'svelte-heros-v2';

	const slotTypeCaster = createSlotTypeCaster<PostsRecord>();
</script>

<div class="p-4">
	<RecordsManager
		collection={Collections.Posts}
		formSettings={{
			hiddenFields: ['owner'],
			hiddenFieldsValues: { owner: $currentUser?.id }
		}}
		editFormSettings={{
			excludedFields: ['select', 'text']
		}}
		{slotTypeCaster}
		let:records
		let:loadRecords
	>
		<div class="space-y-8">
			<RecordsManagerTopbar />
			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Table</Heading>
				{#await loadRecords()}
					<TableSkeleton columns={['checkbox', 'image', 'short text', 'long text', 'actions']} />
				{:then}
					<FilterRecords />
					<RecordsTable
						{records}
						fields={['title']}
						emptyState={{
							title: 'No records',
							description: 'There are no records to show.'
						}}
						showShare
					/>
				{:catch}
					<EmptyState title={'Error'} description={'Something went wrong.'} icon={XCircle} />
				{/await}
			</div>

			<Hr />
			<div class="space-y-4">
				<Heading tag="h4">Cards</Heading>

				{#await loadRecords()}
					<CardPlaceholder />
				{:then}
					{#if records.length === 0}
						<EmptyState title={'No records'} description={'Start adding records.'} icon={XCircle} />
					{:else}
						<div class="grid grid-cols-4 gap-4">
							{#each records as record}
								<RecordCard
									{record}
									titleField="id"
									fieldsComponents={{ select: Chip }}
									showEdit
									showCheckbox
									showDelete
								/>
							{/each}
						</div>
					{/if}
				{:catch}
					<EmptyState title={'Error'} description={'Something went wrong.'} icon={XCircle} />
				{/await}
			</div>
		</div>
	</RecordsManager>
</div>
