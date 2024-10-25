<script lang="ts">
	import { CollectionManager, RecordForm } from '@/collections-components/manager';
</script>

<CollectionManager collection="z_test_collection" expand={['relation_field']} let:records>
	<div class="flex justify-end">
		<RecordForm />
	</div>
	<div class="space-y-2">
		{#each records as record}
			<div class="rounded-md border p-4">
				<p>{record.text_field}</p>
				<p>{record.expand?.relation_field?.email}</p>
				<RecordForm update={record.id} initialData={record} />
			</div>
		{/each}
	</div>
</CollectionManager>
