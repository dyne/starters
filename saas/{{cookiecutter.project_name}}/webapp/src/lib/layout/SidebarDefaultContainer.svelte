<script lang="ts">
	import { getUIShellContext } from './UIShell.svelte';
	import { slide } from 'svelte/transition';

	export let width = 'w-40';

	const { drawerHidden } = getUIShellContext();
</script>

{#if $drawerHidden}
	<div transition:slide={{ axis: 'x' }} class={`flex flex-col ${width}`}>
		<slot />
	</div>
{/if}
