import type { OrganizationsResponse } from '@/pocketbase/types';
import type { m as messages } from '@/i18n';
import type { NavigationTab } from '@/components/custom/navigationTabs.svelte';
import { Cog, Home, Users } from 'lucide-svelte';
import type { SidebarLinkProps } from '@/components/layout/sidebar/types';
import type { OrgRole } from '.';

export function createOrganizationLinks(
	organizationId: string,
	m: typeof messages,
	userRole: OrgRole = 'member'
): NavigationTab[] {
	const base = (path = '') => `/my/organizations/${organizationId}${path}`;

	const links: NavigationTab[] = [
		{
			text: m.Home(),
			href: base(),
			icon: Home,
			activeForSubpages: false
		},

		{
			text: m.Members(),
			href: base('/members'),
			icon: Users
		}
	];

	if (userRole == 'owner') {
		links.push({
			text: m.Settings(),
			href: base('/settings'),
			icon: Cog
		});
	}

	return links;
}

export function createOrganizationSidebarLinks(
	org: OrganizationsResponse,
	m: typeof messages,
	userRole: OrgRole = 'member'
): SidebarLinkProps[] {
	return createOrganizationLinks(org.id, m, userRole);
}
