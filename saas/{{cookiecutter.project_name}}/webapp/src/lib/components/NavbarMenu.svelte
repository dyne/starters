<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		Navbar,
		NavHamburger,
		Button,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,

		NavUl,

		NavLi


	} from 'flowbite-svelte';
	import { featureFlags } from '$lib/features';
	import { currentUser } from '$lib/pocketbase';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import { Fire } from 'svelte-heros-v2';
	import { goto } from '$app/navigation';

	export let breakPoint: number = 1024;
	export let width: number;
	let activateClickOutside = true;
	let drawerHidden: boolean = false;
	$: if (width >= breakPoint) {
		drawerHidden = false;
		activateClickOutside = false;
	} else {
		drawerHidden = true;
		activateClickOutside = true;
	}
	onMount(() => {
		if (width >= breakPoint) {
			drawerHidden = false;
			activateClickOutside = false;
		} else {
			drawerHidden = true;
			activateClickOutside = true;
		}
	});
	const toggleDrawer = () => {
		drawerHidden = false;
	};
	$: activeUrl = $page.url.pathname;
	let spanClass = 'pl-2 self-center text-md text-gray-900 whitespace-nowrap dark:text-white';
	let divClass = 'w-full ml-auto lg:block lg:w-auto order-1 lg:order-none';
	let ulClass =
		'flex flex-col py-3 my-4 lg:flex-row lg:my-0 text-sm font-medium gap-4 dark:lg:bg-transparent lg:bg-white lg:border-0';
	let navDivClass =
		'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 flex items-center justify-between w-full lg:mx-auto py-1.5 px-4';
</script>

<div class="shrink-0">
	<Navbar
		let:hidden
		let:toggle
		fluid={true}
		navClass="px-2 sm:px-4 py-2 md:py-0 fixed w-full z-20 top-0 left-0 border-b"
		{navDivClass}
	>
		<NavHamburger
			on:click={toggleDrawer}
			btnClass="focus:outline-none whitespace-normal rounded-lg focus:ring-2 p-1.5 focus:ring-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 m-0 mr-3 lg:hidden"
		/>
		<div />
		<div>
			<span>Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span></span>
			{#if $featureFlags.DID}
				<Button
					href="https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:{$currentUser?.eddsa_public_key}"
					target="_blank"
					size="xs"
					class="ml-3"
					color="light">My DID</Button
				>
			{/if}
		</div>
		<div class="flex items-center hover:cursor-pointer">
			<button id="avatar-menu">
				<UserAvatar />
			</button>
		</div>
		<Dropdown
			placement="bottom"
			triggeredBy="#avatar-menu"
			footerClass="w-full min-h-screen md:w-fit md:min-h-fit"
		>
			<DropdownHeader>
				<span class="block truncate text-sm font-medium">{$currentUser?.email}</span>
			</DropdownHeader>
			<DropdownItem href="/my/profile">My profile</DropdownItem>
			<DropdownDivider />
			<DropdownItem href="/pro" class="flex items-center"
				><Fire class="text-red-500 mr-2 w-5" /> Go Pro</DropdownItem
			>
			<DropdownDivider />
			<DropdownItem on:click={() => goto('/my/logout')} class="text-primary-600"
				>Sign out</DropdownItem
			>
		</Dropdown>
		<NavUl
				{hidden}
				{divClass}
				{ulClass}
				nonActiveClass="md:!pl-3 md:!py-2 lg:!pl-0 text-gray-700 hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-white lg:dark:hover:text-primary-700 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent"
				activeClass="md:!pl-3 md:!py-2 lg:!pl-0 lg:text-primary-700 text-white dark:text-white dark:lg:text-primary-500 bg-primary-700 lg:bg-transparent dark:bg-primary-600 lg:dark:bg-transparent cursor-default"
			>
				<NavLi class="lg:px-2 lg:mb-0" active={activeUrl === '/'} href="/">Home</NavLi>
				<NavLi class="lg:px-2 lg:mb-0" active={activeUrl === '/pages/about'} href="/pages/about"
					>About</NavLi
				>
				<NavLi
					class="lg:px-2 lg:mb-0"
					href="https://github.com/shinokada/flowbite-sveltekit-responsive-sidebar-layout"
					>GitHub</NavLi
				>
			</NavUl>

		<!-- <NavHamburger on:click={toggle} btnClass="lg:hidden" /> -->
	</Navbar>
</div>
