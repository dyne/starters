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

	export let links: SidebarLink[];

	const toggleSidebar = () => {};
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
							on:click={() => toggleSidebar()}
						/>
					{/each}
				</SidebarDropdownWrapper>
			{:else}
				<SidebarItem label={entry.label} href={entry.href} on:click={() => toggleSidebar()}>
					<svelte:fragment slot="icon">
						<svelte:component this={entry.icon} />
					</svelte:fragment>
				</SidebarItem>
			{/if}
		{/each}
	</SidebarGroup>
</SidebarWrapper>
