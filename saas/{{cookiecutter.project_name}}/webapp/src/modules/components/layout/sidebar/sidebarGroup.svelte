<script lang="ts">
	import { page } from '$app/stores';
	import type { SidebarGroupProps } from './types.ts';
	import { isLinkActive } from '@/utils/other.js';

	import * as Accordion from '@/components/ui/accordion';
	import SidebarLink from './sidebarLink.svelte';
	import { cn } from '@/components/ui/utils';
	import { buttonVariants } from '@/components/ui/button/index.js';
	import { nanoid } from 'nanoid';
	import SidebarIcon from './sidebarIcon.svelte';
	interface Props {
		[key: string]: any
	}

	let { ...props_1 }: Props = $props();

	type $$Props = SidebarGroupProps;


	function isGroupActive({ links }: SidebarGroupProps) {
		return links.some((l) => isLinkActive(l.href, $page, true));
	}

	const name = nanoid(5);

	// TODO - fix behavior of "organization home" link not working
	let props = $derived(props_1 as $$Props);
	let isActive = $derived(isGroupActive(props));
</script>

<Accordion.Root value={isActive ? name : ''}>
	<Accordion.Item
		value={name}
		class={cn('rounded-md ', {
			'ring-primary ring-1': isActive,
			'border-none': !isActive
		})}
	>
		<Accordion.Trigger
			class={cn(
				buttonVariants({
					class: 'justify-between hover:no-underline',
					variant: 'ghost'
				}),
				{
					'hover:bg-transparent': isActive,
					'pointer-events-none opacity-50': props.disabled
				}
			)}
			disabled={props.disabled}
		>
			<div class="flex items-center">
				<SidebarIcon {props} />
				<span>
					{props.text}
				</span>
			</div>
		</Accordion.Trigger>

		<Accordion.Content class="pb-1 pl-4 pr-1 [&>div]:pb-0">
			{#each props.links as link}
				<SidebarLink {...link}></SidebarLink>
			{/each}
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
