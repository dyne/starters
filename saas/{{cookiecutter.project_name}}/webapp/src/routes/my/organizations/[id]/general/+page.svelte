<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { Collections, type OrganizationsRecord } from '$lib/pocketbase/types';
	import { RecordForm } from '$lib/recordForm';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Heading, Avatar, P } from 'flowbite-svelte';

	//

	export let data;

	$: organization = data.organization;
	$: avatarPath = pb.files.getUrl(organization, organization.avatar);

	const recordType = createTypeProp<OrganizationsRecord>();
</script>

<div class="space-y-6">
	<div class="border flex p-4 rounded-xl space-x-4">
		<Avatar src={avatarPath} size="lg" class="object-cover shrink-0" />
		<div class="space-y-1">
			<P size="lg" weight="bold">{organization.name}</P>
			<P>{organization.description}</P>
		</div>
	</div>

	<Heading tag="h4">Edit details</Heading>

	<RecordForm
		{recordType}
		collection={Collections.Organizations}
		recordId={organization.id}
		initialData={organization}
		fieldsSettings={{
			exclude: ['owners']
		}}
		submitButtonText="Save changes"
		on:success={invalidateAll}
	/>
</div>
