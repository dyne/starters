<script lang="ts">
	import { CollectionManager, CollectionTable } from '$lib/collectionManager';
	import { Collections, type OrganizationsRecord } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading, Button, A } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';

	const recordType = createTypeProp<OrganizationsRecord>();
</script>

<div class="flex justify-between items-center mb-6">
	<Heading tag="h5">Your organizations</Heading>
	<Button color="alternative" class="!px-4 shrink-0" href="/my/organizations/create">
		<Plus size="20" />
		<span class="ml-1"> Create a new organization </span>
	</Button>
</div>

<CollectionManager {recordType} collection={Collections.Organizations} let:records perPage={200}>
	<CollectionTable {records} fields={['name']} hideActions={['select', 'edit', 'delete', 'share']}>
		<svelte:fragment slot="emptyState">No organizations here</svelte:fragment>
		<svelte:fragment slot="actions" let:record>
			<A href={`/my/organizations/${record.id}`}>Manage</A>
		</svelte:fragment>
	</CollectionTable>
</CollectionManager>
