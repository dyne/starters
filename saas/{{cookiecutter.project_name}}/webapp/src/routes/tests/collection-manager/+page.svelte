<script lang="ts">
	import { CollectionManager, RecordCreate, RecordEdit } from '@/collections-components/manager';
	import { onMount } from 'svelte';
</script>

<CollectionManager collection="z_test_collection" expand={['relation_field']} let:records>
	<div class="flex justify-end">
		<RecordCreate />
	</div>
	<div class="space-y-2">
		{#each records as record}
			<div class="rounded-md border p-4">
				<p>{record.text_field}</p>
				<p>{record.expand?.relation_field?.email}</p>
				<RecordEdit {record}></RecordEdit>
			</div>
		{/each}
	</div>
</CollectionManager>
