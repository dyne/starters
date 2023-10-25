<script lang="ts">
	import { ListgroupItem } from 'flowbite-svelte';
	import IconButton from './iconButton.svelte';
	import { Pencil } from 'svelte-heros-v2';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const onRemove = () => {
		dispatch('remove');
	};

	const onShow = () => {
		dispatch('show');
	};
</script>

<ListgroupItem>
	<div class="flex justify-between items-center">
		<slot />
		<div>
			<IconButton on:click={onRemove} />
			<IconButton icon={Pencil} on:click={onShow} />
		</div>
	</div>
</ListgroupItem>
