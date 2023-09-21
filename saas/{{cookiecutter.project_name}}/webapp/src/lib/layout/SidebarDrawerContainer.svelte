<script lang="ts">
	import { Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { getUiShellContext } from './UiShell.svelte';

	const { drawerHidden, activateClickOutside, backdrop } = getUiShellContext();

	export let placement: 'left' | 'right' = 'left';
	export let width = 'w-40';

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
	class={`flex flex-col !p-0`}
	{width}
>
	<slot />
</Drawer>
