<script lang="ts">
	import * as Alert from '@/components/ui/alert/index.js';
	import Icon from './icon.svelte';
	import type { ComponentProps } from 'svelte';
	import type { IconComponent } from '@/components/types';
	import { cn } from '../utils';
	interface Props {
		children?: import('svelte').Snippet<[any]>;
		[key: string]: any
	}

	let { ...props_1 }: Props = $props();

	type $$Props = ComponentProps<Alert.Root> & { icon?: IconComponent };
	let props = $derived(props_1 as $$Props);
</script>

<Alert.Root {...props_1} class="{props_1.class} {cn({ '!p-4': !Boolean(props_1.icon) })}">
	{#if props.icon}
		<Icon src={props.icon} size={16}></Icon>
	{/if}

	{@render props_1.children?.({ Title: Alert.Title, Description: Alert.Description, })}
</Alert.Root>
