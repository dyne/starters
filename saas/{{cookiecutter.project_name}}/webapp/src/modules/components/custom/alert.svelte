<script lang="ts">
	import * as Alert from '@/components/ui/alert/index.js';
	import Icon from './icon.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { IconComponent } from '@/components/types';
	import { cn } from '@/components/ui/utils';

	// TODO - Customize variants

	type Props = ComponentProps<typeof Alert.Root> & {
		children?: Snippet<[{ Title: typeof Alert.Title; Description: typeof Alert.Description }]>;
		icon?: IconComponent;
	};

	let { children, icon, ...alertProps }: Props = $props();
</script>

<Alert.Root {...alertProps} class="{alertProps.class} {cn({ '!p-4': !icon })}">
	{#if icon}
		<Icon src={icon} size={16} />
	{/if}

	{@render children?.({ Title: Alert.Title, Description: Alert.Description })}
</Alert.Root>
