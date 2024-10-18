<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { currentUser } from '@/pocketbase';
	import { UIShell, Logo, MainContent, Topbar, HamburgerButton } from '$lib/layout';
	import { m } from '$lib/i18n';
	import { getUserDisplayName } from '$lib/utils/pb';

	import Sidebar from './_partials/sidebar.svelte';

	let sidebarLayoutBreakpoint = 1024;
</script>

<UIShell {sidebarLayoutBreakpoint} let:toggleSidebar>
	<svelte:fragment slot="top" let:sidebarLayoutMode>
		{#if sidebarLayoutMode == 'drawer'}
			<Topbar>
				<svelte:fragment slot="left">
					<div class="flex space-x-2">
						<Logo />
					</div>
				</svelte:fragment>
				<svelte:fragment slot="center">
					<div class="flex items-center">
						{#if $currentUser}
							<span class="whitespace-nowrap">
								{m.hello()},
								<span class="text-primary-600 font-semibold">
									{getUserDisplayName($currentUser)}
								</span>
							</span>
						{/if}
					</div>
				</svelte:fragment>
				<svelte:fragment slot="right">
					<HamburgerButton />
				</svelte:fragment>
			</Topbar>
		{/if}
	</svelte:fragment>

	<Sidebar></Sidebar>

	<MainContent>
		<div class="min-h-screen overflow-auto bg-[url('/bg.png')] bg-cover">
			<slot />
		</div>
	</MainContent>
</UIShell>
