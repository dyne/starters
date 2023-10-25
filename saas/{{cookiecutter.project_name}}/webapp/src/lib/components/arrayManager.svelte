<script lang="ts">
	import { Listgroup } from 'flowbite-svelte';
	import ListgroupItemButton from './listgroupItemButton.svelte';

	type T = $$Generic;

	export let array: T[];

	function removeItem(item: T) {
		array = array.filter((i) => i !== item);
	}
</script>

{#if array.length > 0}
	<Listgroup>
		{#each array as item (item)}
			<ListgroupItemButton on:click={() => removeItem(item)}>
				<slot {item} />
			</ListgroupItemButton>
		{/each}
	</Listgroup>
{/if}
