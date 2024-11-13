<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		left?: Snippet;
		center?: Snippet;
		right?: Snippet;
	}

	let { left, center, right }: Props = $props();
</script>

<div class="shrink-0 border-b">
	<div class="mx-auto flex max-w-screen-xl items-center justify-between p-2">
		<div class="shrink-0 items-center">
			{@render left?.()}
		</div>
		<div class="flex items-center justify-center gap-2">
			{@render center?.()}
		</div>
		<div class="flex shrink-0 items-center">
			{@render right?.()}
		</div>
	</div>
</div>
