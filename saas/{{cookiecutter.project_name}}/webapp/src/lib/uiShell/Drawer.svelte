<script lang="ts">
	import { CloseButton, Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { getUiShellContext } from './UiShell.svelte';
	import Logo from './Logo.svelte';

	const { drawerHidden, activateClickOutside, backdrop } = getUiShellContext();

	export let placement: 'left' | 'right'  = 'left';

	export let divClass = `overflow-hidden z-50 p-4 bg-white w-fit fixed inset-y-0 ${placement}-0`

    let transitionParams = {
		x: placement == 'right'? 320 : -320,
		duration: 200,
		easing: sineIn
	};
    
</script>

<Drawer
	transitionType="fly"
	backdrop={$backdrop}
	{transitionParams}
	bind:hidden={$drawerHidden}
	activateClickOutside={$activateClickOutside}
	{placement}
	width="w-64"
	id="sidebar"
	{divClass}
>
	<div class="flex items-center mb-2 px-3">
		<Logo/>
		<CloseButton on:click={() => ($drawerHidden = true)} class="dark:text-white md:hidden" />
	</div>
	<slot />
</Drawer>
