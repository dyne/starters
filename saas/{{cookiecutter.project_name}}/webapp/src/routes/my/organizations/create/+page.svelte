<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { RecordForm } from '$lib/recordForm';
	import { currentUser } from '$lib/pocketbase';
	import { Collections, type OrganizationsRecord } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import type { PBResponse } from '$lib/utils/types';

	const recordType = createTypeProp<OrganizationsRecord>();
	const userId = $currentUser!.id;

	function handleSuccess(e: CustomEvent<{ record: PBResponse<OrganizationsRecord> }>) {
		window.location.replace(`/my/organizations/${e.detail.record.id}`);
	}
</script>

<div class="space-y-8">
	<Heading tag="h4">Create an organization</Heading>
	<RecordForm
		{recordType}
		collection={Collections.Organizations}
		fieldsSettings={{
			labels: {
				name: 'Organization name',
				description: 'Short description',
				avatar: 'Avatar'
			}
		}}
		submitButtonText="Create organization"
		on:success={handleSuccess}
	/>
</div>
