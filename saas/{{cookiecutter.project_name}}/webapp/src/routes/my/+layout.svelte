<script lang="ts">
	import UiShell from '$lib/uiShell/UiShell.svelte';
	import BottomSidebarMenu from '$lib/uiShell/BottomSidebarMenu.svelte';
	import SidebarShell from '$lib/uiShell/SidebarShell.svelte';
	import TopbarNav from '$lib/uiShell/TopbarNav.svelte';
	import Hamburger from '$lib/uiShell/Hamburger.svelte';
	import { currentUser } from '$lib/pocketbase';
	import DidButton from '$lib/uiShell/DidButton.svelte';
	import AvatarMenu from '$lib/uiShell/AvatarMenu.svelte';
	import primaryMenu from './primaryMenu';
	import secondaryMenu from './secondaryMenu';
	import Logo from '$lib/uiShell/Logo.svelte';

	let breakPoint: number = 1024;
</script>

<UiShell {breakPoint} let:mobile>
	<TopbarNav>
		<div slot="left">
			{#if mobile}
				<Hamburger />
			{:else}
				<Logo />
			{/if}
		</div>
		<div slot="center">
			<div>
				<span>Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span></span
				>
				<DidButton />
			</div>
		</div>
		<div class="flex items-center hover:cursor-pointer" slot="right">
			<AvatarMenu />
		</div>
	</TopbarNav>
	<div class="h-0 grow flex">
		<SidebarShell bottomMenu={BottomSidebarMenu} {primaryMenu} {secondaryMenu} />
		<div
			class="p-1 lg:p-4 pt-8 lg:pt-16 bg-slate-100 grow bg-[url('/bg.png')] bg-cover min-h-screen overflow-auto"
		>
			<main class="rounded-lg bg-white flex flex-col shadow-md p-2 lg:p-8 pb-16 w-full">
				<slot />
			</main>
		</div>
	</div>
</UiShell>
