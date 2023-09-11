<script lang="ts">
	import Layout from '$lib/components/LayoutTopSide.svelte';
	import { Pencil } from 'svelte-heros-v2';
	// export let data: PageData;

	let breakPoint: number = 1024;
	let width: number;
	const primaryMenu = [
		{
			label: 'Overview',
			href: '/my',
			icon: Pencil
		},
		{
			label: 'Pages',
			icon: Pencil,
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
			icon: Pencil,
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
			icon: Pencil,
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
			icon: Pencil,
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
			icon: Pencil
		},
		{
			label: 'Help',
			href: '/my/help',
			icon: Pencil
		},
		{
			label: 'Sign Out',
			href: '/my/signout',
			icon: Pencil
		}
	];
</script>

<svelte:window bind:innerWidth={width} />
<div class="w-screen h-screen overflow-hidden flex flex-col">
	<Layout {breakPoint} {width} {primaryMenu} {secondaryMenu}>
		<slot />
	</Layout>
</div>
