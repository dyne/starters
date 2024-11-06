<script lang="ts" module>
	export interface NavigationTabProps extends LinkWithIcon {
		activeForSubpages?: boolean;
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { LinkWithIcon } from '@/components/types';
	import { isLinkActive } from '@/utils/other';
	import Icon from '@/components/custom/icon.svelte';
	import { cn } from '@/components/utils';

	interface Props {
		props: NavigationTabProps;
	}

	let { props }: Props = $props();
	let { href, icon, text, activeForSubpages = true } = props;

	//

	let isActive = $derived(isLinkActive(href, $page, activeForSubpages));

	let classes = $derived(cn(
		'inline-block text-sm font-medium text-center p-4 py-3 border-b-2 flex items-center whitespace-nowrap',
		{
			'border-transparent hover:border-primary/20': !isActive,
			'text-primary border-primary border-b-2': isActive
		}
	));
</script>

<a role="tab" class={classes} {href}>
	{#if icon}
		<Icon src={icon} mr></Icon>
	{/if}
	{text}
</a>
