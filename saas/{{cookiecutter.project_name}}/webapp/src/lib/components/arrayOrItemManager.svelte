<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Listgroup } from 'flowbite-svelte';
	import ListgroupItemButton from './listgroupItemButton.svelte';

	type T = $$Generic;
	export let value: T | T[] | undefined;

	let tempItems: T[] = [];
	$: {
		if (Array.isArray(value)) tempItems = value;
		else if (value) tempItems = [value];
		else tempItems = [];
	}

	const dispatch = createEventDispatcher<{
		show: {
			item: T;
		};
	}>();

	function removeItem(item: T) {
		if (Array.isArray(value)) value = value.filter((i) => i !== item);
		else value = undefined;
	}
	function showItem(item: T) {
		dispatch('show', {item} );
	}
</script>

{#if tempItems.length > 0}
	<Listgroup>
		{#each tempItems as item (item)}
			<ListgroupItemButton on:remove={() => removeItem(item)} on:show={() => showItem(item)}>
				<slot {item} />
			</ListgroupItemButton>
		{/each}
	</Listgroup>
{/if}
