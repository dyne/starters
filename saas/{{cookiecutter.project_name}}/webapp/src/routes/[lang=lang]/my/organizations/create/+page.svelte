<script lang="ts">
	import { A, Heading } from 'flowbite-svelte';
	import { RecordForm } from '$lib/recordForm';
	import { Collections, type OrganizationsResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import LL from '$i18n/i18n-svelte';

	const recordType = createTypeProp<OrganizationsResponse>();

	function handleSuccess(e: CustomEvent<{ record: OrganizationsResponse }>) {
		window.location.assign($LL.LINK(`/my/organizations/${e.detail.record.id}`));
	}
</script>

<div class="space-y-8">
	<A href={$LL.LINK('/my/organizations')}>← My organizations</A>
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
