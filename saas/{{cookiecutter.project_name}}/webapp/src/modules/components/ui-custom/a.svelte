<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type $$Props = HTMLAnchorAttributes & { href: string };

	interface Props {
		href: $$Props['href'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { href, children, ...rest }: Props = $props();
</script>

<a {href} {...rest}>
	{@render children?.()}
</a>

<style lang="postcss">
	a {
		@apply text-primary hover:underline;
	}
</style>
