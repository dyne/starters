<script lang="ts">
	import { CloseButton } from 'flowbite-svelte';
	import { getUiShellContext } from './';

	const { drawerHidden } = getUiShellContext();
</script>

<CloseButton on:click={() => ($drawerHidden = true)} />
