<script lang="ts">
	import type { SidebarButtonProps } from './types.js';
	import Button from '@/components/ui/button/button.svelte';
	import SidebarIcon from './sidebarIcon.svelte';
	import { Record } from 'effect';
	import type { ComponentProps } from 'svelte';
	import { cn } from '@/components/utils.js';
	interface Props {
		right?: import('svelte').Snippet;
		[key: string]: any
	}

	let { ...props_1 }: Props = $props();

	type $$Props = ComponentProps<Button> & SidebarButtonProps & { isActive?: boolean };
	let props = $derived(props_1 as $$Props);

	let classes = $derived(cn('flex w-full items-center !justify-between', {
		'pointer-events-none opacity-50': props.disabled
	}));
</script>

<Button
	variant={props.isActive ? 'secondary' : 'ghost'}
	class={classes}
	on:click
	{...Record.remove(props_1, 'text')}
	size="sm"
>
	<div class="flex items-center">
		<SidebarIcon {props} />
		<span>
			{props.text}
		</span>
	</div>
	{@render props_1.right?.()}
</Button>
