<script lang="ts" context="module">
	import type { IconComponent } from '$lib/utils/types';

	export interface SidebarLink {
		label: string;
		disabled?: boolean;
		href?: string;
		icon?: IconComponent;
		subLinks?: SidebarLink[];
		badge?: {
			text: string;
			color: string;
		};
	}
</script>

<script lang="ts">
	import {
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import { getUiShellContext } from './UiShell.svelte';

	export let links: SidebarLink[];

	const { toggleSidebar, useDrawerLayout } = getUiShellContext();
	const toggleSidebarHandler = () => {
		if ($useDrawerLayout) {
			toggleSidebar()
		}
	}
</script>

<SidebarWrapper>
	<SidebarGroup>
		{#each links as entry}
			{#if entry.subLinks}
				<SidebarDropdownWrapper label={entry.label}>
					<svelte:fragment slot="icon">
						<svelte:component this={entry.icon} />
					</svelte:fragment>
					{#each entry.subLinks as subEntry}
						<SidebarDropdownItem
							label={subEntry.label}
							href={subEntry.href}
							on:click={() => toggleSidebarHandler()}
						/>
					{/each}
				</SidebarDropdownWrapper>
			{:else}
				<SidebarItem label={entry.label} href={entry.href} on:click={() => toggleSidebarHandler()}>
					<svelte:fragment slot="icon">
						<svelte:component this={entry.icon} />
					</svelte:fragment>
				</SidebarItem>
			{/if}
		{/each}
	</SidebarGroup>
</SidebarWrapper>
