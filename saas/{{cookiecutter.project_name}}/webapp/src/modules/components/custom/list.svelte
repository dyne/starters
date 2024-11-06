<script lang="ts">
	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();
	
</script>

<div class="divide-y overflow-hidden rounded-md border {className}">
	{@render children?.()}
</div>
