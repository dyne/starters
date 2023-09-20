<script lang="ts">
	import { CloseButton, Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { getUiShellContext } from './UiShell.svelte';
	import Logo from './Logo.svelte';

	const { drawerHidden, activateClickOutside, backdrop } = getUiShellContext();

	export let placement: 'left' | 'right' = 'left';

	let transitionParams = {
		x: placement == 'right' ? 320 : -320,
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
>
	<div class="flex items-center mb-2 px-3">
		<Logo />
		<CloseButton on:click={() => ($drawerHidden = true)} class="dark:text-white md:hidden" />
	</div>
	<slot />
</Drawer>
