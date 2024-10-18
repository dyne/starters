<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Collections, type OrganizationsResponse } from '@/pocketbase/types';
	import { RecordForm } from '$lib/recordForm';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { m } from '$lib/i18n';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '@/components/custom/pageCard.svelte';
	import T from '@/components/custom/t.svelte';

	//

	export let data;
	$: organization = data.organization;

	const recordType = createTypeProp<OrganizationsResponse>();
</script>

<OrganizationLayout org={organization}>
	<PageCard>
		<T tag="h4" class="mb-6">{m.Manage_your_organization_public_info()}</T>
		<RecordForm
			{recordType}
			collection={Collections.Organizations}
			recordId={organization.id}
			initialData={organization}
			submitButtonText={m.Save_changes()}
			on:success={invalidateAll}
			formSettings={{ dataType: 'form' }}
		/>
	</PageCard>
</OrganizationLayout>
