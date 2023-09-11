<script lang="ts">
	import Layout from '$lib/components/LayoutTopSide.svelte';
	import {
		GlobeAlt,
		Document,
		RocketLaunch,
		Inbox,
		User,
		Cog,
		QuestionMarkCircle,
		ArrowRightOnRectangle
	} from 'svelte-heros-v2';
	import BottomSidebarMenu from '$lib/components/BottomSidebarMenu.svelte';

	let breakPoint: number = 1024;
	let width: number;
	const primaryMenu = [
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

	const secondaryMenu = [
		{
			label: 'Settings',
			href: '/my/settings',
			icon: Cog
		},
		{
			label: 'Help',
			href: '/my/help',
			icon: QuestionMarkCircle
		},
		{
			label: 'Sign Out',
			href: '/my/signout',
			icon: ArrowRightOnRectangle
		}
	];
</script>

<svelte:window bind:innerWidth={width} />
<div class="w-screen h-screen overflow-hidden flex flex-col">
	<Layout {breakPoint} {width} {primaryMenu} {secondaryMenu} bottomMenu={BottomSidebarMenu}>
		<slot />
	</Layout>
</div>
