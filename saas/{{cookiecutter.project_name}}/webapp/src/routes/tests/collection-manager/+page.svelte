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
	import { XCircle } from 'svelte-heros-v2';

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
			exclude: ['select', 'text']
		}}
		let:records
	>
		<div class="space-y-8">
			<CollectionManagerHeader />

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Table</Heading>

				<CollectionSearch {recordType} searchableFields={['text', 'textarea']} />
				<CollectionTable
					{records}
					fields={['id', 'text', 'textarea']}
					emptyState={{
						title: 'No records',
						description: 'There are no records to show.'
					}}
				/>
			</div>

			<Hr />

			<div class="space-y-4">
				<Heading tag="h4">Cards</Heading>
				{#if records.length === 0}
					<!-- Todo: show a custom empty state -->
					<CollectionEmptyState
						title={'No records'}
						description={'Start adding records.'}
						icon={XCircle}
					/>
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
