<script lang="ts" context="module">
	export type SidebarLayoutMode = 'default' | 'drawer';
</script>

<script lang="ts">
	import { ScrollArea } from '@/components/ui/scroll-area/index.js';

	let className = '';
	export { className as class };
</script>

<div class="flex flex-col border-r {className}">
	{#if $$slots.top}
		<div class="shrink-0 border-b">
			<slot name="top" />
		</div>
	{/if}

	<ScrollArea class="h-0 grow">
		<slot />
	</ScrollArea>

	<div class="shrink-0 border-t">
		<slot name="bottom" />
	</div>
</div>
