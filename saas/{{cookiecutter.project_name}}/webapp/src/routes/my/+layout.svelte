<script lang="ts">
	import UiShell from '$lib/layout/UiShell.svelte';
	import Sidebar from '$lib/layout/Sidebar.svelte';
	import Topbar from '$lib/layout/Topbar.svelte';
	import Hamburger from '$lib/layout/Hamburger.svelte';
	import { currentUser } from '$lib/pocketbase';
	import DidButton from '$lib/layout/DidButton.svelte';
	import AvatarMenu from '$lib/layout/AvatarMenu.svelte';
	import { links } from './sidebarLinks';
	import Logo from '$lib/layout/Logo.svelte';
	import { DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import SidebarCloseButton from '$lib/layout/SidebarCloseButton.svelte';
	import SidebarLinks from '$lib/layout/SidebarLinks.svelte';
	import { goto } from '$app/navigation';
	import { Fire } from 'svelte-heros-v2';
	import MainContent from '$lib/layout/MainContent.svelte';

	let breakPoint: number = 1024;
</script>

<UiShell {breakPoint}>
	<Topbar slot="top" let:mobile>
		<svelte:fragment slot="left">
			<div class="flex space-x-2">
				<Hamburger />
				{#if !mobile}
					<Logo />
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="center">
			<div>
				<span>Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span></span
				>
				<DidButton />
			</div>
		</svelte:fragment>
		<svelte:fragment slot="right">
			<AvatarMenu>
				<DropdownHeader>
					<span class="block truncate text-xs font-medium text-gray-500">
						{$currentUser?.email}
					</span>
				</DropdownHeader>
				<DropdownItem href="/my/profile">My profile</DropdownItem>
				<DropdownDivider />
				<DropdownItem href="/pro" class="flex items-center">
					<Fire class="text-red-500 mr-2 w-5" /> Go Pro</DropdownItem
				>
				<DropdownDivider />
				<DropdownItem on:click={() => goto('/my/logout')} class="text-primary-600">
					Sign out
				</DropdownItem>
			</AvatarMenu>
		</svelte:fragment>
	</Topbar>

	<Sidebar>
		<svelte:fragment slot="top">
			<div class="flex items-center mb-2 px-3">
				<Logo />
				<SidebarCloseButton />
			</div>
		</svelte:fragment>
		<SidebarLinks {links} />
		<svelte:fragment slot="bottom">bottom</svelte:fragment>
	</Sidebar>

	<MainContent>
		<slot />
	</MainContent>
</UiShell>
