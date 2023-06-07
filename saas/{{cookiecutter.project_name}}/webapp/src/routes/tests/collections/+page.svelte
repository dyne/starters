<script lang="ts">
	import { Collections } from '$lib/pocketbase-types';
	import { Card } from 'flowbite-svelte';

	const collections = Object.values(Collections);
</script>

<div class="p-4 space-y-4">
	{#each collections as collection}
		<Card href={`/tests/collections/${collection}`}>{collection}</Card>
	{/each}
</div>
