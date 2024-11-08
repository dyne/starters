<script lang="ts">
	import { m } from '@/i18n';
	import * as Avatar from '@/components/ui/avatar';
	import type { ComponentProps } from 'svelte';

	type Props = ComponentProps<typeof Avatar.Root> & {
		src?: string;
		alt?: string;
		fallback?: string;
	};

	const { src, alt, fallback, ...rest }: Props = $props();
</script>

<Avatar.Root {...rest}>
	{#if src}
		<Avatar.Image {src} alt={alt ?? m.Avatar()} />
	{/if}
	{#if fallback}
		<Avatar.Fallback>{fallback}</Avatar.Fallback>
	{/if}
</Avatar.Root>
