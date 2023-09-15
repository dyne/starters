<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type CrudExampleRecord } from '$lib/pocketbase/types';

	import { createTypeProp } from '$lib/utils/typeProp';
	import {
		CollectionManager,
		CollectionSearch,
		CollectionManagerHeader,
		CollectionEmptyState,
		CollectionTable,
		RecordCard
	} from '$lib/collectionManager';
	import Chip from '$lib/collectionManager/ui/fieldComponents/chip.svelte';

	import { Heading, Hr } from 'flowbite-svelte';
	import EditRecord from '$lib/collectionManager/ui/recordActions/editRecord.svelte';

	const recordType = createTypeProp<CrudExampleRecord>();
</script>

<div class="p-4">
	<CollectionManager
		{recordType}
		collection={Collections.CrudExample}
		formSettings={{
			hide: { owner: $currentUser?.id }
		}}
		editFormSettings={{
			exclude: ['select']
		}}
		let:records
	>
		<div class="space-y-8">
			<CollectionManagerHeader />

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Table</Heading>

				<CollectionSearch {recordType} searchableFields={['text', 'textarea']} />
				<CollectionTable {records} fields={['id', 'text', 'textarea']} let:record>
					<svelte:fragment slot="emptyState">
						<CollectionEmptyState
							title="Custom empty state"
							description="Displaying some custom text here!"
						/>
					</svelte:fragment>

					<EditRecord {record} formSettings={{ exclude: ['relation_single'] }} />
				</CollectionTable>
			</div>

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Cards</Heading>
				{#if records.length === 0}
					<CollectionEmptyState />
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
			</div>
		</div>
	</CollectionManager>
</div>
