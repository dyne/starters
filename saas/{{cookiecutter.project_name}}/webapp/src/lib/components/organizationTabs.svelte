<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { m } from '@/i18n';
	import { currentUser } from '@/pocketbase';
	import { getUserRole, type OrgRole } from '@/organizations';
	import { createOrganizationLinks } from '@/organizations';
	import type { NavigationTabProps } from './navigationTab.svelte';
	import NavigationTabs from './navigationTabs.svelte';

	export let organizationId: string;

	//

	let userRole: OrgRole = 'member';

	$: getUserRole(organizationId, $currentUser?.id ?? '').then((res) => {
		userRole = res;
	});

	//

	let tabs: NavigationTabProps[] = [];

	$: tabs = createOrganizationLinks(organizationId, m, userRole);
</script>

{#key tabs}
	<NavigationTabs {tabs}></NavigationTabs>
{/key}
