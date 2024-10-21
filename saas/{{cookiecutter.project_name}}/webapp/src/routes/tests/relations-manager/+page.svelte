<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import RecordSelect from '@/components/records/recordSelect.svelte';
	import { Collections } from '@/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import type { CrudExampleResponse } from '@/pocketbase/types';
	import RecordSearch from '@/components/records/recordSearch.svelte';
	import RecordsManager from '@/components/records/recordsManager.svelte';

	let searchValue: string | undefined = undefined;
	const collection = Collections.CrudExample;
	const recordType = createTypeProp<CrudExampleResponse>();
</script>

<div class="space-y-4 p-8">
	<p>Record select</p>
	<RecordSelect {recordType} {collection} bind:recordId={searchValue} />
	<pre>{JSON.stringify(searchValue)}</pre>
</div>

<div class="space-y-4 p-8">
	<p>Record search</p>
	<RecordSearch {collection} bind:recordId={searchValue} options={{ placeholder: 'mimmo' }} />
</div>

<div class="space-y-4 p-8">
	<p>Records manager</p>

	<RecordsManager
		{collection}
		{recordType}
		options={{
			multiple: true,
			inputMode: 'select',
			max: 3,
			showActions: ['create'],
			formSettings: {}
		}}
	/>
</div>
