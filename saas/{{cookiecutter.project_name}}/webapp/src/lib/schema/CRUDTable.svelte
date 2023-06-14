<script lang="ts">
	import { pb } from '$lib/pocketbase';
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
	import { getCollectionSchema } from './getCollectionSchema';

	//

	export let collection: Collections;
	export let displayFields: string[] = ['id'];

	let dataPromise = (async () => {
		return await pb.collection(collection).getFullList();
	})();
</script>

{#await dataPromise}
	<Spinner />
{:then data}
	<Table>
		<TableHead>
			{#each displayFields as field}
				<TableHeadCell>{field}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each data as item (item.id)}
				<TableBodyRow>
					{#each displayFields as field}
						<TableBodyCell>{item[field]}</TableBodyCell>
					{/each}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/await}
