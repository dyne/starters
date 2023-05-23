<script lang="ts">
	import { featureFlags } from '$lib/pocketbase';
	import { log } from '$lib/utils/devLog';

	export let flag: string;

	let flagRecord = $featureFlags.find((f) => f.name == flag);
	if (!flagRecord) log('flagNotFound:', flag);
</script>

{#if flagRecord && flagRecord.active}
	<slot />
{/if}
