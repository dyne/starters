<script lang="ts">
	import RecordSearch from '@/components/records/recordSearch.svelte';
</script>

<RecordSearch
	collection="features"
	options={{
		recordPresenter: (record) => {
			return {
				label: JSON.stringify(record.envVariables)
			};
		}
	}}
/>
