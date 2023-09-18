<script>
	import { appTitle } from '$lib/strings';

	import { CloseButton, Drawer, NavBrand } from 'flowbite-svelte';
	
	import { sineIn } from 'svelte/easing';
	import { getUiShellContext } from './UiShell.svelte';

	const { drawerHidden, activateClickOutside, backdrop } = getUiShellContext();
	export let logo = '/logo.svg';

    let transitionParams = {
		x: -320,
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
	width="w-64"
	id="sidebar"
	divClass="overflow-hidden z-50 p-4 bg-white dark:bg-gray-800 w-fit fixed inset-y-0 left-0"
>
	<div class="flex items-center mb-2 px-3">
		<NavBrand href="/my">
			<img src={logo} class="h-9" alt={appTitle} />
		</NavBrand>
		<CloseButton on:click={() => ($drawerHidden = true)} class="dark:text-white md:hidden" />
	</div>
	<slot />
</Drawer>
