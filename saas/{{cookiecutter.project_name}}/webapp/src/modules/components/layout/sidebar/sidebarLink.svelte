<script lang="ts">
	import { page } from '$app/stores';
	import Badge from '@/components/ui/badge/badge.svelte';
	import type { SidebarLinkProps } from './types.ts';
	import { isLinkActive } from '@/utils/other.js';
	import SidebarButton from './sidebarButton.svelte';
	interface Props {
		[key: string]: any
	}

	let { ...props_1 }: Props = $props();

	type $$Props = SidebarLinkProps;
	let props = $derived(props_1 as $$Props);

	let isActive = $derived(isLinkActive(props.href, $page));
</script>

<SidebarButton {...props} {isActive}>
	{#snippet right()}
	
			{#if props.badge}
				<Badge variant="secondary">{props.badge}</Badge>
			{/if}
		
	{/snippet}
</SidebarButton>
