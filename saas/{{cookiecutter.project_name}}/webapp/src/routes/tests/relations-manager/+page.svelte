<script lang="ts">
	import RecordSelect from '$lib/components/records/recordSelect.svelte';
	// import RelationsManager from '$lib/components/relationsManager.svelte';
	import { Collections } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import type { FeaturesRecord } from '$lib/pocketbase/types';
	import RecordSearch from '$lib/components/records/recordSearch.svelte';

	const collection = Collections.Features;

	let searchValue: string | undefined = 'bmr7acxvx09904l';
	const recordType = createTypeProp<FeaturesRecord>();
</script>

<div class="p-8 space-y-4">
	<p>Record select</p>
	<RecordSelect
		{recordType}
		{collection}
		bind:value={searchValue}
		displayFields={['name']}
		excludeIds={['qzum90ct7eymkv9']}
	/>
	<RecordSelect {recordType} {collection} bind:value={searchValue} />
	<pre>{JSON.stringify(searchValue)}</pre>
</div>
<div class="p-8 space-y-4">
	<p>Record search</p>
	<RecordSearch {collection} bind:value={searchValue} placeholder="mimmo" />
</div>
<!-- <RelationsManager collection={Collections.Features}></RelationsManager> -->
<!-- <div class="mt-12">
	<p>users</p>
	<RecordSelect {recordType} collection={Collections.Users} />
</div> -->
