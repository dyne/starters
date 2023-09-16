<script lang="ts">
	import UiShell from '$lib/uiShell/UiShell.svelte';
	import BottomSidebarMenu from '$lib/uiShell/BottomSidebarMenu.svelte';
	import Sidebar from '$lib/uiShell/Sidebar.svelte';
	import Navbar from '$lib/uiShell/Navbar.svelte';
	import Hamburger from '$lib/uiShell/Hamburger.svelte';
	import { currentUser } from '$lib/pocketbase';
	import DidButton from '$lib/uiShell/DidButton.svelte';
	import AvatarMenu from '$lib/uiShell/AvatarMenu.svelte';
	import primaryMenu from './primaryMenu';
	import secondaryMenu from './secondaryMenu';
	let breakPoint: number = 1024;
</script>

<div class="w-screen h-screen overflow-hidden flex flex-col">
	<UiShell {breakPoint}>
		<div class="shrink-0">
			<Navbar>
				<div slot="start">
					<Hamburger />
				</div>
				<div slot="center">
					<div>
						<span
							>Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span
							></span
						>
						<DidButton />
					</div>
				</div>
				<div class="flex items-center hover:cursor-pointer" slot="end">
					<AvatarMenu />
				</div>
			</Navbar>
		</div>

		<Sidebar bottomMenu={BottomSidebarMenu} {primaryMenu} {secondaryMenu}>
			<slot />
		</Sidebar>
	</UiShell>
</div>
