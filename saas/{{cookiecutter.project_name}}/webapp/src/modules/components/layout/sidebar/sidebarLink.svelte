<script lang="ts">
	import { page } from '$app/stores';
	import Badge from '@/components/ui/badge/badge.svelte';
	import type { SidebarLinkProps } from './types.ts';
	import Button from '@/components/ui/button/button.svelte';
	import { isLinkActive } from '@/utils/other.js';
	import SidebarIcon from './sidebarIcon.svelte';

	type $$Props = SidebarLinkProps;
	$: props = $$props as $$Props;

	$: isActive = isLinkActive(props.href, $page);
	// TODO - implement disable
</script>

<Button
	href={props.href}
	variant={isActive ? 'secondary' : 'ghost'}
	class="flex w-full items-center justify-between"
>
	<div class="flex items-center">
		<SidebarIcon {props} />
		<span>
			{props.text}
		</span>
	</div>
	{#if props.badge}
		<Badge>{props.badge}</Badge>
	{/if}
</Button>
