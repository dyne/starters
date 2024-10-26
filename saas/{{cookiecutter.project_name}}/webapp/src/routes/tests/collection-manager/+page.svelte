<script lang="ts">
	import { CollectionManager, RecordCreate, RecordCard } from '@/collections-components/manager';
</script>

<CollectionManager
	collection="z_test_collection"
	fetchOptions={{
		expand: ['relation_field'],
		perPage: 6
	}}
	let:records
>
	<div class="space-y-4">
		<div class="flex justify-end gap-2">
			<RecordCreate />
		</div>

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
