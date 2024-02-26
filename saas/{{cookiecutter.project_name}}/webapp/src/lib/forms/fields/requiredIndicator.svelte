<script lang="ts">
	import type { ControlAttrs } from 'formsnap';

	export let attrs: ControlAttrs | undefined = undefined;
</script>

{#if attrs && Boolean(attrs['aria-required'])}
	<span class="text-red-400">*</span>
{/if}
