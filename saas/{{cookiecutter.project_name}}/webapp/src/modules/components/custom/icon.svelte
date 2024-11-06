<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	import type { IconComponent } from '@/components/types';
	import type { IconProps } from 'lucide-svelte';
	import { cn } from '@/components/utils';

	type $$Props = IconProps & { src: IconComponent; ml?: boolean; mr?: boolean };

	export let src: $$Props['src'];
	export let size: $$Props['size'] = 16;

	$: classes = cn($$props, {
		'mr-2': $$props.mr,
		'ml-2': $$props.ml
	});
</script>

<svelte:component this={src} {size} {...$$restProps} class="${$$props.class} ${classes}" />
