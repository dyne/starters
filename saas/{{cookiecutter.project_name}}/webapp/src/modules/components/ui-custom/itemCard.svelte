<script lang="ts">
	import Title from './itemCardTitle.svelte';
	import Description from './itemCardDescription.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		left?: Snippet;
		children?: Snippet<[{ Title: typeof Title; Description: typeof Description }]>;
		right?: Snippet;
	}

	let { class: className = '', left, children, right }: Props = $props();
</script>

<div class="flex items-center gap-4 rounded-lg border p-4 {className}">
	{#if left}
		<div class="shrink-0">
			{@render left?.()}
		</div>
	{/if}

	<div class="w-0 grow overflow-hidden">
		{@render children?.({ Title, Description })}
	</div>

	{#if right}
		<div class="shrink-0">
			{@render right?.()}
		</div>
	{/if}
</div>
