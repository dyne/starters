<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let data;
	data.items;
</script>

<div class="p-4 flex justify-end border-b border-b-gray-400">
	<Button href={`/tests/collections/${data.collectionName}/new`} color="alternative">+ New</Button>
</div>
<div class="p-4 space-y-4">
	{#each data.items as item (item.id)}
		<div class="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
			<pre>{JSON.stringify(item, null, 2)}</pre>
			<Button href={`/tests/collections/${data.collectionName}/${item.id}`} color="alternative">
				Edit
			</Button>
		</div>
	{/each}
</div>
