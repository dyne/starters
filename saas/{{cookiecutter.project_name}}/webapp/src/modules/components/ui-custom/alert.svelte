<script lang="ts">
	import * as Alert from '@/components/ui/alert/index.js';
	import Icon from './icon.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { IconComponent } from '@/components/types';
	import { cn } from '@/components/ui/utils';

	// TODO - Customize variants

	type Props = ComponentProps<typeof Alert.Root> & {
		content?: Snippet<[{ Title: typeof Alert.Title; Description: typeof Alert.Description }]>;
		children?: Snippet;
		icon?: IconComponent;
	};

	let { children, content, icon, ...alertProps }: Props = $props();
</script>

<Alert.Root {...alertProps} class="{alertProps.class} {cn({ '!p-4': !icon })}">
	{#if icon}
		<Icon src={icon} size={16} />
	{/if}

	{@render content?.({ Title: Alert.Title, Description: Alert.Description })}

	{@render children?.()}
</Alert.Root>
