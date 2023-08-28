<script lang="ts">
	export let flags: boolean | boolean[];
	const display = Array.isArray(flags) ? flags.every((f) => f) : flags;
</script>

{#if display}
	<slot />
{/if}
