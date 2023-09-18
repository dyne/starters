<script lang="ts">
	import {
		Sidebar,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import primaryMenu from '../../routes/my/primaryMenu';
	import secondaryMenu from '../../routes/my/secondaryMenu';

	export let bottomMenu: any;
</script>

<Sidebar asideClass="w-54">
	<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
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
		<SidebarGroup class="absolute bottom-0 w-full">
			{#if Boolean(bottomMenu)}
				<svelte:component this={bottomMenu} />
			{/if}
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
