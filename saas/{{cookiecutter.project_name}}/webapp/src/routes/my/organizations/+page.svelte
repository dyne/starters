<script lang="ts">
	import { CollectionManager } from '$lib/collectionManager';
	import { Collections, type OrganizationsRecord } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading, Button, A } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';

	const recordType = createTypeProp<OrganizationsRecord>();
</script>

<div class="flex justify-between items-center mb-6">
	<Heading tag="h5">Your organizations</Heading>
	<Button size="sm" color="alternative" class="!px-4 shrink-0" href="/my/organizations/create">
		<Plus size="20" />
		<span class="ml-1"> Create a new organization </span>
	</Button>
</div>

<CollectionManager {recordType} collection={Collections.Organizations} let:records perPage={200}>
	<div class="border rounded-lg divide-y">
		{#if records.length == 0}
			<div class="p-4 text-gray-600">No organizations found. Create one!</div>
		{:else}
			{#each records as record}
				<div class="px-4 py-3 flex justify-between items-center">
					<A href={`/my/organizations/${record.id}`}>{record.name}</A>
					<Button size="sm" color="alternative" href={`/my/organizations/${record.id}/settings`}>
						Settings
					</Button>
				</div>
			{/each}
		{/if}
	</div>
</CollectionManager>
