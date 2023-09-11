<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { Badge, P } from 'flowbite-svelte';
	import type { Record } from 'pocketbase';
	export let value: string;
	export let record: Record
    record;
	const isOwned = $currentUser?.id === value;
</script>

{#if isOwned}
	<P size="sm">You</P>
{:else}
	<Badge color="blue">Shared</Badge>
{/if}