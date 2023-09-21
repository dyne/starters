<script lang="ts">
	import { CloseButton } from 'flowbite-svelte';
	import { getUiShellContext } from './UiShell.svelte';

	const { drawerHidden } = getUiShellContext();
</script>

<CloseButton on:click={() => ($drawerHidden = true)} class="dark:text-white md:hidden" />
