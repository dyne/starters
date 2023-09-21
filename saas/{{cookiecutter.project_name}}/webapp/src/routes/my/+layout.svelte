<script lang="ts">
	import {
		UIShell,
		Sidebar,
		Topbar,
		Hamburger,
		DidButton,
		AvatarMenu,
		Logo,
		SidebarLinks
	} from '$lib/layout';
	import { currentUser } from '$lib/pocketbase';
	import { links } from './sidebarLinks';
	import { DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import SidebarCloseButton from '$lib/layout/SidebarCloseButton.svelte';
	import { goto } from '$app/navigation';
	import { Fire } from 'svelte-heros-v2';
	import MainContent from '$lib/layout/MainContent.svelte';

	let sidebarLayoutBreakpoint = 1024;
</script>

<UIShell {sidebarLayoutBreakpoint}>
	<Topbar slot="top" let:sidebarLayoutMode>
		<svelte:fragment slot="left">
			<div class="flex space-x-2">
				<Hamburger />
				{#if sidebarLayoutMode == 'default'}
					<Logo />
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="center">
			<div class="flex items-center">
				<div>
					<span class="whitespace-nowrap">
						Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span>
					</span>
				</div>
				<div class="shrink-0">
					<DidButton />
				</div>
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
			<div class="flex items-center p-3">
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
</UIShell>
