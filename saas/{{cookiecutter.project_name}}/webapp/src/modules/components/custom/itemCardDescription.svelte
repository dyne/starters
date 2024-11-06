<script lang="ts">
	import T from '@/components/custom/t.svelte';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();
	
</script>

<T class="text-card-foreground text-sm {className}">{@render children?.()}</T>
