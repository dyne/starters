<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import OrganizationBreadcrumbs from './organizationBreadcrumbs.svelte';
	import PageTop from '@/components/custom/pageTop.svelte';
	import OrganizationTabs from './organizationTabs.svelte';
	import type { OrganizationsResponse } from '@/pocketbase/types';
	import PageContent from './pageContent.svelte';
	import T from '@/components/custom/t.svelte';

	export let org: OrganizationsResponse;
</script>

<PageTop>
	<OrganizationBreadcrumbs />
	<T tag="h4">{org.name}</T>
	<OrganizationTabs slot="bottom" organizationId={org.id} />
</PageTop>

<PageContent>
	<slot />
</PageContent>
