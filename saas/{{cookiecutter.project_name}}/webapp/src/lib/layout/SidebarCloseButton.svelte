<script lang="ts">
	import { CloseButton } from 'flowbite-svelte';
	import { getUIShellContext } from './UIShell.svelte';

	const { drawerHidden } = getUIShellContext();
</script>

<CloseButton on:click={() => ($drawerHidden = true)} />
