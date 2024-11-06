<script lang="ts">
	import { m } from '@/i18n';
	import * as Avatar from '@/components/ui/avatar';
	import type { AvatarProps } from 'bits-ui';
	interface Props {
		[key: string]: any
	}

	let { ...props_1 }: Props = $props();

	type $$Props = AvatarProps & { src?: string; alt?: string; fallback?: string };
	let props = $derived(props_1 as $$Props);
</script>

<Avatar.Root {...props_1}>
	{#if props.src}
		<Avatar.Image src={props.src} alt={props.alt ?? m.Avatar()} />
	{/if}
	{#if props.fallback}
		<Avatar.Fallback>{props.fallback}</Avatar.Fallback>
	{/if}
</Avatar.Root>
