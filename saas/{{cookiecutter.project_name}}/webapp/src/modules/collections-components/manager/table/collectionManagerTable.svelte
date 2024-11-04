<script lang="ts" generics="T">
	import type { KeyOf } from '@/utils/types';
	import * as Table from '@/components/ui/table';
	import Th from './th.svelte';
	import Td from './td.svelte';

	export let records: T[];
	export let fields: KeyOf<T>[] = [];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			{#each fields as field}
				<Th {field}></Th>
			{/each}
			<slot name="header" {Th} />
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each records as record}
			<Table.Row>
				{#each fields as field}
					<Td {field}>{record[field]}</Td>
				{/each}
				<slot name="row" {Td} />
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
