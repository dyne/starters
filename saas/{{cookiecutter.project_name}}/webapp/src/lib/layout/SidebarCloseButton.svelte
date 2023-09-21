<script lang="ts">
	import { CloseButton } from 'flowbite-svelte';
	import { getUiShellContext } from './UIShell.svelte';

	const { drawerHidden } = getUiShellContext();
</script>

<CloseButton on:click={() => ($drawerHidden = true)} />
