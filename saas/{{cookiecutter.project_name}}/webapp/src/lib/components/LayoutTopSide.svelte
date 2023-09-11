<script context="module" lang="ts">
	export interface MenuLink {
		label: string;
		href?: string;
		icon?: ConstructorOfATypedSvelteComponent | null | undefined;
		subMenu?: MenuLink[];
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import SidebarMenu from '$lib/components/SidebarLayout.svelte';
	import Navbar from '$lib/components/NavbarMenu.svelte';
	import UserAvatar from './userAvatar.svelte';
	import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import { Fire } from 'svelte-heros-v2';
	import { currentUser } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	export let breakPoint: number = 1024;
	export let width: number;
	export let primaryMenu: MenuLink[];
	export let secondaryMenu: MenuLink[];
	export let hideNavbar: boolean = false;

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
	const toggleSide = () => {
		if (width < breakPoint) {
			drawerHidden = !drawerHidden;
		}
	};
</script>

<div class="w-screen h-screen overflow-hidden flex flex-col">
	<slot name="navbar">
		<div class="shrink-0">
			{#if !hideNavbar}
				<Navbar {toggleSide}>
					<div class="flex items-center hover:cursor-pointer" slot="end">
						<button id="avatar-menu">
							<UserAvatar />
						</button>
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
					</div>
				</Navbar>
			{/if}
		</div>
	</slot>
	<SidebarMenu
		{primaryMenu}
		{secondaryMenu}
		{drawerHidden}
		{activateClickOutside}
	>
		<slot />
	</SidebarMenu>
</div>
