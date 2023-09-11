<script lang="ts">
	import {
		NavBrand,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Drawer,
		CloseButton,
		SidebarDropdownWrapper,
		SidebarDropdownItem
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import type { MenuLink } from './LayoutTopSide.svelte';

	export let logo = '/logo.svg';
	export let secondaryMenu: MenuLink[] = [];
	export let primaryMenu: MenuLink[] = [];
	export let bottomMenu: ConstructorOfATypedSvelteComponent | null | undefined;

	let appTitle = '{{ cookiecutter.project_name }}';

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	export let drawerHidden: boolean;
	export let activateClickOutside = true;
	export let backdrop: boolean = false;
</script>

<div class="w-screen h-screen overflow-hidden flex flex-col">
	<div class="h-0 grow flex">
		<Drawer
			transitionType="fly"
			{backdrop}
			{transitionParams}
			bind:hidden={drawerHidden}
			bind:activateClickOutside
			width="w-64"
			id="sidebar"
			divClass="overflow-hidden z-50 p-4 bg-white dark:bg-gray-800 w-fit fixed inset-y-0 left-0"
		>
			<div class="flex items-center mb-2 px-3">
				<NavBrand href="/my">
					<img src={logo} class="h-9" alt={appTitle} />
				</NavBrand>
				<CloseButton on:click={() => (drawerHidden = true)} class="dark:text-white md:hidden" />
			</div>
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
		</Drawer>

		<div
			class="p-1 lg:p-8 pt-20 lg:pt-32 bg-slate-100 grow bg-[url('/bg.png')] bg-cover lg:ml-72 min-h-screen overflow-auto"
		>
			<main class="rounded-lg p-2 md:p-4 bg-white flex flex-col space gap-10 shadow-md">
				<slot />
			</main>
		</div>
	</div>
</div>
