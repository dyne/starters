<script>
	import { Button } from 'flowbite-svelte';
	import { getUiShellContext } from './UiShell.svelte';
	import { Bars3 } from 'svelte-heros-v2';

	const { toggleSide } = getUiShellContext();
</script>

<Button color="alternative" class="!p-1.5" on:click={toggleSide}>
	<Bars3 size="24" />
</Button>

<!--
	@component
	
	## Hamburger
	this hamburger is useful for opening the drawer, if there is one

-->
