<script lang="ts">
	import { features } from '$lib/pocketbase';
	import { log } from '$lib/utils/devLog';

	export let flag: string;

	let feature = $features.find((f) => f.name == flag);
	if (!feature) log('flagNotFound:', flag);
</script>

{#if feature && feature.active}
	<slot />
{/if}
