<script lang="ts">
	interface Props {
		left?: import('svelte').Snippet;
		center?: import('svelte').Snippet;
		right?: import('svelte').Snippet;
	}

	let { left, center, right }: Props = $props();
</script>

<div class="shrink-0 border-b">
	<div class="flex items-center justify-between px-3 py-2">
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

<!-- 
	@component 

	### Slots
	- left - the left side of the navbar
	- center - the center of the navbar
	- right - the right side of the navbar
	
-->
