<script lang="ts">
	import RecordSearch from '@/components/records/recordSearch.svelte';
</script>

<RecordSearch
	collection="z_test_collection"
	expand
	onSelect={(record) => {
		record.expand.relation_multi_field;
		console.log('ok');
	}}
	presenter={(record) => {
		record.expand.relation_field;
		return '';
	}}
/>
