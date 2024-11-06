<script lang="ts">
	import { ScrollArea } from '@/components/ui/scroll-area/index.js';

	interface Props {
		class?: string;
		top?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		bottom?: import('svelte').Snippet;
	}

	let {
		class: className = '',
		top,
		children,
		bottom
	}: Props = $props();
	
</script>

<div class="flex flex-col {className}">
	{#if top}
		<div class="shrink-0 border-b">
			{@render top?.()}
		</div>
	{/if}

	<ScrollArea class="h-0 grow">
		{@render children?.()}
	</ScrollArea>

	<div class="shrink-0 border-t">
		{@render bottom?.()}
	</div>
</div>
