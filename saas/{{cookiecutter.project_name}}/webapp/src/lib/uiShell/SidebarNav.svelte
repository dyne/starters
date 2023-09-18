<script lang="ts">
	import {
		Sidebar,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import type { MenuLink } from './UiShell.svelte';

	export let bottomMenu: any;
	export let primaryMenu: MenuLink[];
	export let secondaryMenu: MenuLink[];
</script>

<Sidebar asideClass="w-54 h-full">
	<SidebarWrapper divClass="overflow-y-auto pt-4 px-3 h-full">
		<div class="flex flex-col justify-between h-full">
			<div>
				<SidebarGroup>
					{#each primaryMenu as entry}
						{#if entry.subMenu}
							<SidebarDropdownWrapper label={entry.label}>
								<svelte:fragment slot="icon">
									<svelte:component this={entry.icon} />
								</svelte:fragment>
								{#each entry.subMenu as subEntry}
									<SidebarDropdownItem label={subEntry.label} href={subEntry.href} />
								{/each}
							</SidebarDropdownWrapper>
						{:else}
							<SidebarItem label={entry.label} href={entry.href}>
								<svelte:fragment slot="icon">
									<svelte:component this={entry.icon} />
								</svelte:fragment>
							</SidebarItem>
						{/if}
					{/each}
				</SidebarGroup>
				<SidebarGroup border>
					{#each secondaryMenu as entry}
						<SidebarItem label={entry.label} href={entry.href}>
							<svelte:fragment slot="icon">
								<svelte:component this={entry.icon} />
							</svelte:fragment>
						</SidebarItem>
					{/each}
				</SidebarGroup>
			</div>
			<SidebarGroup class="pb-4 w-full">
				{#if Boolean(bottomMenu)}
					<svelte:component this={bottomMenu} />
				{/if}
			</SidebarGroup>
		</div>
	</SidebarWrapper>
</Sidebar>
