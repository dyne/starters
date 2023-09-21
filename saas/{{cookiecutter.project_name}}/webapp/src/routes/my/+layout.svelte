<script lang="ts">
	import {UiShell, Sidebar, Topbar, Hamburger, DidButton, AvatarMenu, Logo, SidebarLinks} from '$lib/layout';
	import { currentUser } from '$lib/pocketbase';
	import { links } from './sidebarLinks';
	import { DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import SidebarCloseButton from '$lib/layout/SidebarCloseButton.svelte';
	import { goto } from '$app/navigation';
	import { Fire } from 'svelte-heros-v2';
	import MainContent from '$lib/layout/MainContent.svelte';

	let sidebarWidthThreshold: number = 1024;
</script>

<UiShell {sidebarWidthThreshold}>
	<Topbar slot="top" let:useDrawerLayout>
		<svelte:fragment slot="left">
			<div class="flex space-x-2">
				<Hamburger />
				{#if !useDrawerLayout}
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
</UiShell>
