<script lang="ts">
	import Button, { type ButtonProps } from '@/components/ui/button/button.svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '@/components/ui/utils';
	import type { IconComponent } from '@/components/types.js';
	import SidebarIcon from './sidebarIcon.svelte';

	interface Props extends ButtonProps {
		right?: Snippet;
		isActive?: boolean;
		icon?: IconComponent | string;
		text: string;
	}

	let { right, isActive, icon, children, text, ...rest }: Props = $props();

	const classes = $derived(
		cn(rest.class, 'flex w-full items-center !justify-between', {
			'pointer-events-none opacity-50': rest.disabled
		})
	);
</script>

<Button variant={isActive ? 'secondary' : 'ghost'} class={classes} size="sm" {...rest}>
	<div class="flex items-center">
		<!-- TODO - Fix icon -->
		<SidebarIcon {icon} {text} />
		<span>
			{text}
		</span>
	</div>

	{@render right?.()}
</Button>
