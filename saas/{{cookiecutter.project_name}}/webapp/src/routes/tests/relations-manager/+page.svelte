<script lang="ts">
	import RecordSelect from '$lib/components/recordSelect.svelte';
	import RelationsManager from '$lib/components/relationsManager.svelte';
	import { Collections } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import type { FeaturesRecord } from '$lib/pocketbase/types';

	const collection = Collections.Features;

	let searchValue: string | undefined = 'bmr7acxvx09904l';
	const recordType = createTypeProp<FeaturesRecord>();
</script>

<RecordSelect {recordType} {collection} bind:value={searchValue} displayFields={['name']} />
<RecordSelect {recordType} {collection} bind:value={searchValue} />
<pre>{JSON.stringify(searchValue)}</pre>
<!-- <RelationsManager collection={Collections.Features}></RelationsManager> -->
