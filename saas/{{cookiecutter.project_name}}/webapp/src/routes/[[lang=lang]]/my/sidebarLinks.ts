import type { SidebarLink } from '$lib/layout';
import { GlobeAlt, Inbox, RocketLaunch, User, Document } from 'svelte-heros-v2';
import type { TranslationFunctions } from '$i18n/i18n-types';

export function links(LL: TranslationFunctions): SidebarLink[] {
	return [
		{
			label: 'Overview',
			href: '/my',
			icon: GlobeAlt
		},
		{
			label: LL.PAGES(),
			icon: Document,
			subLinks: [
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
			subLinks: [
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
			subLinks: [
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
			subLinks: [
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
}
