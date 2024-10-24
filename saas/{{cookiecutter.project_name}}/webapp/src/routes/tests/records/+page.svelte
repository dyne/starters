<script lang="ts">
	import RecordSearch from '@/components/records/recordSearch.svelte';
</script>

<RecordSearch
	collection="z_test_collection"
	expand
	presenter={(record) => {
		return [record.text_field, record.expand?.relation_multi_field?.map((u) => u.name)].join(' | ');
	}}
/>
