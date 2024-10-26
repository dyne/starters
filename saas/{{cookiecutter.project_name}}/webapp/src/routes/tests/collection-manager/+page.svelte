<script lang="ts">
	import { CollectionManager, RecordCreate, RecordCard } from '@/collections-components/manager';
</script>

<CollectionManager
	collection="z_test_collection"
	expand={['relation_field']}
	let:records
	let:selectedRecords
	let:Pagination
	perPage={4}
>
	<div class="space-y-4">
		<pre>{JSON.stringify(selectedRecords)}</pre>

		<div class="flex justify-end gap-2">
			<RecordCreate />
		</div>

		<Pagination />

		<div class="space-y-2">
			{#each records as record}
				<RecordCard {record} let:Title let:Description>
					<Title>{record.text_field}</Title>
					<Description>{record.expand?.relation_field?.email}</Description>
				</RecordCard>
			{/each}
		</div>
	</div>
</CollectionManager>
