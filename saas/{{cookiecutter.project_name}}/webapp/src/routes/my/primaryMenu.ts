import type { MenuLink } from "$lib/uiShell/UiShell.svelte";
import { GlobeAlt, Inbox, RocketLaunch, User, Document } from "svelte-heros-v2";

const primaryMenu:MenuLink[] = [
		{
			label: 'Overview',
			href: '/my',
			icon: GlobeAlt
		},
		{
			label: 'Pages',
			icon: Document,
			subMenu: [
				{
					label: 'Profile',
					href: '/my/profile'
				},
				{
					label: 'Kanban',
					href: '/'
				},
				{
					label: 'Calendar',
					href: '/'
				}
			]
		},
		{
			label: 'Sales',
			icon: RocketLaunch,
			subMenu: [
				{
					label: 'Products',
					href: '/'
				},
				{
					label: 'Billing',
					href: '/'
				},
				{
					label: 'Invoice',
					href: '/'
				}
			]
		},
		{
			label: 'Messages',
			href: '/',
			icon: Inbox,
			subMenu: [
				{
					label: 'Inbox',
					href: '/'
				},
				{
					label: 'Sent',
					href: '/'
				},
				{
					label: 'Drafts',
					href: '/'
				}
			]
		},
		{
			label: 'Authentication',
			icon: User,
			subMenu: [
				{
					label: 'Sign In',
					href: '/'
				},
				{
					label: 'Sign Up',
					href: '/'
				},
				{
					label: 'Forgot Password',
					href: '/'
				}
			]
		}
	];

export default primaryMenu;