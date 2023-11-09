<script lang="ts">
	import { Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';

	export let hidden = true;
	export let placement: 'left' | 'right' = 'left';
	export let width = 'w-40';
	export let backdrop = true;
	export let closeOnClickOutside = true;

	$: transitionDirection = placement == 'right' ? 1 : -1;
	$: transitionParams = {
		x: 320 * transitionDirection,
		duration: 200,
		easing: sineIn
	};
</script>

<Drawer
	bind:hidden
	transitionType="fly"
	{backdrop}
	{transitionParams}
	activateClickOutside={closeOnClickOutside}
	{placement}
	class={`flex flex-col !p-0`}
	{width}
>
	<slot />
</Drawer>
