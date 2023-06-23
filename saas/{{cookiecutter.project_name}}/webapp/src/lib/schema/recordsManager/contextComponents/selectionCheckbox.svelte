<script lang="ts">
	import { Checkbox } from 'flowbite-svelte';
	import { getRecordsManagerContext } from '../recordsManager.svelte';
	import type { Record } from 'pocketbase';

	export let record: Record;
	const { selectedRecords } = getRecordsManagerContext();
</script>

<Checkbox bind:group={$selectedRecords} value={record.id} name="select" />
