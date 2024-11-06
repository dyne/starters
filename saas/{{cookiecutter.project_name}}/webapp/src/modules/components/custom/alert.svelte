<script lang="ts">
	import * as Alert from '@/components/ui/alert/index.js';
	import Icon from './icon.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { IconComponent } from '@/components/types';
	import { cn } from '../utils';

	type Props = ComponentProps<typeof Alert.Root> & {
		content?: Snippet<[{ Title: typeof Alert.Title; Description: typeof Alert.Description }]>;
		icon?: IconComponent;
	};

	let { content, icon, ...alertProps }: Props = $props();
</script>

<Alert.Root {...alertProps} class="{alertProps.class} {cn({ '!p-4': !icon })}">
	{#if icon}
		<Icon src={icon} size={16} />
	{/if}

	{@render content?.({ Title: Alert.Title, Description: Alert.Description })}
</Alert.Root>
