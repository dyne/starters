<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { currentUser } from '@/pocketbase';
	import { Logo, Topbar, HamburgerButton, UiShell } from '@/components/layout';
	import { m } from '@/i18n';
	import { getUserDisplayName } from '@/pocketbase/utils';

	import MySidebar from './_partials/mySidebar.svelte';

	let sidebarLayoutBreakpoint = 1024;
</script>

<UiShell {sidebarLayoutBreakpoint}>
	<svelte:fragment slot="top" let:sidebarMode>
		{#if sidebarMode == 'drawer'}
			<Topbar>
				<svelte:fragment slot="left">
					<Logo />
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

				<HamburgerButton slot="right" />
			</Topbar>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="sidebar">
		<MySidebar />
	</svelte:fragment>

	<slot />
</UiShell>
