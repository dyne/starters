<script lang="ts">
	import T from './t.svelte';


	interface Props {
		label?: string | undefined;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { label = undefined, class: className = '', children }: Props = $props();
	
</script>

<div class="bg-primary-foreground pl-3 {className}">
	{#if children}{@render children()}{:else}
		{#if label}
			<T tag="small">{label}</T>
		{/if}
	{/if}
</div>
