<script lang="ts">
	import Terminal from 'lucide-svelte/icons/terminal';
	import * as Alert from '@/components/ui/alert/index.js';
	import Icon from './icon.svelte';
	import type { ComponentProps } from 'svelte';
	import type { IconComponent } from '@/components/types';

	type $$Props = ComponentProps<Alert.Root> & { icon?: IconComponent };
	$: props = $$props as $$Props;
</script>

<Alert.Root {...$$props}>
	{#if props.icon}
		<Icon src={props.icon} size={16}></Icon>
	{/if}

	<slot Title={Alert.Title} Description={Alert.Description} />
</Alert.Root>
