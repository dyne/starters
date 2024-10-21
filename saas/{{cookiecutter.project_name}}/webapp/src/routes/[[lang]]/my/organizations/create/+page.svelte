<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { RecordForm } from '$lib/recordForm';
	import { Collections, type OrganizationsResponse } from '@/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { m } from '$lib/i18n';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '@/components/custom/pageCard.svelte';
	import PageTop from '@/components/custom/pageTop.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { Button } from '@/components/ui/button';
	import T from '@/components/custom/t.svelte';

	const recordType = createTypeProp<OrganizationsResponse>();

	function handleSuccess(e: CustomEvent<{ record: OrganizationsResponse }>) {
		window.location.assign(`/my/organizations/${e.detail.record.id}`);
	}
</script>

<PageTop>
	<Button href="/my/organizations" variant="outline" size="sm">
		<Icon src={ArrowLeft} mr></Icon>
		{m.Back_to_my_organizations()}
	</Button>
	<T tag="h4">{m.Create_an_organization()}</T>
</PageTop>

<PageContent>
	<PageCard>
		<RecordForm
			{recordType}
			collection={Collections.Organizations}
			fieldsSettings={{
				labels: {
					name: m.Organization_name(),
					description: m.Short_description(),
					avatar: m.Avatar()
				}
			}}
			submitButtonText={m.Create_organization()}
			on:success={handleSuccess}
		/>
	</PageCard>
</PageContent>
