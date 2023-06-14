<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { Record } from 'pocketbase';
	import type { Collections } from '$lib/pocketbase-types';
	import {
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let collection: Collections;

	let loading = true;
	let data: Record[];

	onMount(async () => {
		data = await pb.collection(collection).getFullList();
		loading = false;
	});
</script>

{#if loading}
	<Spinner />
{:else if data}
	<script>
		import {
			Table,
			TableBody,
			TableBodyCell,
			TableBodyRow,
			TableHead,
			TableHeadCell
		} from 'flowbite-svelte';
	</script>

	<Table>
		<TableHead>
			<TableHeadCell>Item</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each data as item (item.id)}
				<TableBodyRow>
					<TableBodyCell><pre>{JSON.stringify(item, null, 2)}</pre></TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
