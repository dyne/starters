<script lang="ts">
	import RecordSelect from '$lib/components/records/recordSelect.svelte';
	// import RelationsManager from '$lib/components/relationsManager.svelte';
	import { Collections } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import type { FeaturesRecord } from '$lib/pocketbase/types';
	import RecordSearch from '$lib/components/records/recordSearch.svelte';
	import RecordsManager from '$lib/components/records/recordsManager.svelte';

	const collection = Collections.Features;

	let searchValue: string | undefined = 'bmr7acxvx09904l';
	const recordType = createTypeProp<FeaturesRecord>();
</script>

<div class="p-8 space-y-4">
	<p>Record select</p>
	<RecordSelect
		{recordType}
		{collection}
		bind:recordId={searchValue}
		options={{
			displayFields: ['name'],
			excludeIds: ['qzum90ct7eymkv9']
		}}
	/>
	<RecordSelect {recordType} {collection} bind:recordId={searchValue} />
	<pre>{JSON.stringify(searchValue)}</pre>
</div>

<div class="p-8 space-y-4">
	<p>Record search</p>
	<RecordSearch {collection} bind:recordId={searchValue} options={{ placeholder: 'mimmo' }} />
</div>

<div class="p-8 space-y-4">
	<p>Records manager</p>

	<RecordsManager {collection} options={{ multiple: true }}></RecordsManager>
	<RecordsManager {collection} options={{ multiple: true, inputMode: 'select' }}></RecordsManager>
</div>
