<script lang="ts">
	import { CollectionSelect } from '@/collections-management';
	import RecordSearch from '@/collections-management/collectionSearch.svelte';
</script>

<div class="space-y-4">
	<RecordSearch
		collection="z_test_collection"
		expand
		presenter={(record) => {
			return [record.text_field, record.expand?.relation_multi_field?.map((u) => u.name)].join(
				' | '
			);
		}}
	/>

	<CollectionSelect collection="z_test_collection" onSelect={(r) => console.log(r)} />
</div>
