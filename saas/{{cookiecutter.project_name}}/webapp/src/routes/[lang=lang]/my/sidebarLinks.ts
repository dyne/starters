import type { SidebarLink } from '$lib/layout';
import { GlobeAlt, Inbox, RocketLaunch, User, Document } from 'svelte-heros-v2';
import type { TranslationFunctions } from '$i18n/i18n-types';

export function links(LL: TranslationFunctions): SidebarLink[] {
	return [
		{
			label: 'Overview',
			href: LL.LINK('/my'),
			icon: GlobeAlt
		},
		{
			label: LL.PAGES(),
			icon: Document,
			subLinks: [
				{
					label: 'Profile',
					href: LL.LINK('/my/profile')
				},
				{
					label: 'Kanban',
					href: LL.LINK('/')
				},
				{
					label: 'Calendar',
					href: LL.LINK('/')
				}
			]
		},
		{
			label: 'Sales',
			icon: RocketLaunch,
			subLinks: [
				{
					label: 'Products',
					href: LL.LINK('/')
				},
				{
					label: 'Billing',
					href: LL.LINK('/')
				},
				{
					label: 'Invoice',
					href: LL.LINK('/')
				}
			]
		},
		{
			label: 'Messages',
			href: LL.LINK('/'),
			icon: Inbox,
			subLinks: [
				{
					label: 'Inbox',
					href: LL.LINK('/')
				},
				{
					label: 'Sent',
					href: LL.LINK('/')
				},
				{
					label: 'Drafts',
					href: LL.LINK('/')
				}
			]
		},
		{
			label: 'Authentication',
			icon: User,
			subLinks: [
				{
					label: 'Sign In',
					href: LL.LINK('/')
				},
				{
					label: 'Sign Up',
					href: LL.LINK('/')
				},
				{
					label: 'Forgot Password',
					href: LL.LINK('/')
				}
			]
		}
	];
}
