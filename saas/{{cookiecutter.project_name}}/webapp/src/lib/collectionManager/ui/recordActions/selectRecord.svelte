<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Array } from 'effect';

	import { Checkbox } from '@/components/ui/checkbox';

	import { getRecordsManagerContext } from '../../collectionManager.svelte';
	import type { PBResponse } from '$lib/utils/types';

	type RecordGeneric = $$Generic<PBResponse>;
	export let record: RecordGeneric;

	let { selectionManager } = getRecordsManagerContext();
	let { selectedRecords } = selectionManager;

	$: checked = $selectedRecords.includes(record.id);

	function handleChecked(value: string | boolean) {
		if (value === true) $selectedRecords.push(record.id);
		else $selectedRecords = Array.remove($selectedRecords, $selectedRecords.indexOf(record.id));
	}
</script>

<Checkbox
	{checked}
	onCheckedChange={(e) => handleChecked(e.valueOf())}
	value={record.id}
	name="select"
/>
