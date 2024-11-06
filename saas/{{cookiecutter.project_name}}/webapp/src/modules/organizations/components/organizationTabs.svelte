<script lang="ts">
	import { run } from 'svelte/legacy';

	import { m } from '@/i18n';
	import { currentUser } from '@/pocketbase';
	import { getUserRole, type OrgRole } from '@/organizations';
	import { createOrganizationLinks } from '@/organizations';
	import type { NavigationTabProps } from '@/components/custom/navigationTab.svelte';
	import NavigationTabs from '@/components/custom/navigationTabs.svelte';

	interface Props {
		organizationId: string;
	}

	let { organizationId }: Props = $props();

	//

	let userRole: OrgRole = $state('member');

	run(() => {
		getUserRole(organizationId, $currentUser?.id ?? '').then((res) => {
			userRole = res;
		});
	});

	//

	let tabs: NavigationTabProps[] = $state([]);

	run(() => {
		tabs = createOrganizationLinks(organizationId, m, userRole);
	});
</script>

{#key tabs}
	<NavigationTabs {tabs}></NavigationTabs>
{/key}
