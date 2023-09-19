<script>
	import { NavHamburger } from 'flowbite-svelte';
	import { getUiShellContext } from './UiShell.svelte';
	const { toggleSide } = getUiShellContext();
</script>

<NavHamburger
	on:click={toggleSide}
	btnClass="focus:outline-none whitespace-normal rounded-lg focus:ring-2 p-1.5 focus:ring-gray-400 hover:bg-gray-100 m-0 mr-3 "
/>

<!--
	@component
	
	## Hamburger
	this hamburger is useful for opening the drawer, if there is one

-->
