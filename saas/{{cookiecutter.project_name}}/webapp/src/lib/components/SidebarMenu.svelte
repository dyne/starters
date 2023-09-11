<script lang="ts">
	import { onMount } from 'svelte';
	import {
		NavBrand,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Drawer,
		CloseButton,
		SidebarDropdownWrapper,
		SidebarDropdownItem,
		Dropdown,
		DropdownItem,
		Button
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { SidebarBottomNav, SidebarBottomNavItem } from 'flowbite-svelte-blocks';
	import type { MenuLink } from './LayoutTopSide.svelte';

	export let logo = '/logo.svg';
	export let secondaryMenu: MenuLink[] = [];
	export let primaryMenu: MenuLink[] = [];

	let appTitle = '{{ cookiecutter.project_name }}';

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	export let breakPoint: number = 1024;
	export let width: number;
	let backdrop: boolean = false;
	let activateClickOutside = true;
	let drawerHidden: boolean = false;
	$: if (width >= breakPoint) {
		drawerHidden = false;
		activateClickOutside = false;
	} else {
		drawerHidden = true;
		activateClickOutside = true;
	}
	onMount(() => {
		if (width >= breakPoint) {
			drawerHidden = false;
			activateClickOutside = false;
		} else {
			drawerHidden = true;
			activateClickOutside = true;
		}
	});
	const toggleSide = () => {
		if (width < breakPoint) {
			drawerHidden = !drawerHidden;
		}
	};
	const toggleDrawer = () => {
		drawerHidden = false;
	};
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
			<div class="flex items-center mb-2">
				<NavBrand href="/my">
					<img src={logo} class="mr-3 h-6 sm:h-9" alt={appTitle} />
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
					<SidebarGroup class="relative pt-64">
						<SidebarBottomNav>
							<SidebarBottomNavItem href="/" tooltip="Profile">
								<svg
									aria-hidden="true"
									class="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									><path
										d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
									/></svg
								>
							</SidebarBottomNavItem>
							<SidebarBottomNavItem href="/" tooltip="Settings page">
								<svg
									aria-hidden="true"
									class="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									><path
										fill-rule="evenodd"
										d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
										clip-rule="evenodd"
									/></svg
								>
							</SidebarBottomNavItem>
							<Dropdown placement="top" triggeredBy="#countries">
								<DropdownItem>
									<div class="inline-flex items-center">
										<svg
											aria-hidden="true"
											class="h-3.5 w-3.5 rounded-full mr-2"
											xmlns="http://www.w3.org/2000/svg"
											id="flag-icon-css-us"
											viewBox="0 0 512 512"
										>
											<g fill-rule="evenodd">
												<g stroke-width="1pt">
													<path
														fill="#bd3d44"
														d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
														transform="scale(3.9385)"
													/>
													<path
														fill="#fff"
														d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
														transform="scale(3.9385)"
													/>
												</g>
												<path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)" />
												<path
													fill="#fff"
													d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
													transform="scale(3.9385)"
												/>
											</g>
										</svg>
										English (US)
									</div>
								</DropdownItem>
								<DropdownItem>
									<div class="inline-flex items-center">
										<svg
											aria-hidden="true"
											class="h-3.5 w-3.5 rounded-full mr-2"
											xmlns="http://www.w3.org/2000/svg"
											id="flag-icon-css-de"
											viewBox="0 0 512 512"
										>
											<path fill="#ffce00" d="M0 341.3h512V512H0z" />
											<path d="M0 0h512v170.7H0z" />
											<path fill="#d00" d="M0 170.7h512v170.6H0z" />
										</svg>
										Deutsch
									</div>
								</DropdownItem>
								<DropdownItem>
									<div class="inline-flex items-center">
										<svg
											aria-hidden="true"
											class="h-3.5 w-3.5 rounded-full mr-2"
											xmlns="http://www.w3.org/2000/svg"
											id="flag-icon-css-it"
											viewBox="0 0 512 512"
										>
											<g fill-rule="evenodd" stroke-width="1pt">
												<path fill="#fff" d="M0 0h512v512H0z" />
												<path fill="#009246" d="M0 0h170.7v512H0z" />
												<path fill="#ce2b37" d="M341.3 0H512v512H341.3z" />
											</g>
										</svg>
										Italiano
									</div>
								</DropdownItem>
								<DropdownItem>
									<div class="inline-flex items-center">
										<svg
											aria-hidden="true"
											class="h-3.5 w-3.5 rounded-full mr-2"
											xmlns="http://www.w3.org/2000/svg"
											xmlns:xlink="http://www.w3.org/1999/xlink"
											id="flag-icon-css-cn"
											viewBox="0 0 512 512"
										>
											<defs>
												<path id="a" fill="#ffde00" d="M1-.3L-.7.8 0-1 .6.8-1-.3z" />
											</defs>
											<path fill="#de2910" d="M0 0h512v512H0z" />
											<use
												width="30"
												height="20"
												transform="matrix(76.8 0 0 76.8 128 128)"
												xlink:href="#a"
											/>
											<use
												width="30"
												height="20"
												transform="rotate(-121 142.6 -47) scale(25.5827)"
												xlink:href="#a"
											/>
											<use
												width="30"
												height="20"
												transform="rotate(-98.1 198 -82) scale(25.6)"
												xlink:href="#a"
											/>
											<use
												width="30"
												height="20"
												transform="rotate(-74 272.4 -114) scale(25.6137)"
												xlink:href="#a"
											/>
											<use
												width="30"
												height="20"
												transform="matrix(16 -19.968 19.968 16 256 230.4)"
												xlink:href="#a"
											/>
										</svg>
										中文 (繁體)
									</div>
								</DropdownItem>
							</Dropdown>
							<Button
								btnClass="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:hover:text-white dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600"
								id="countries"
							>
								<svg
									aria-hidden="true"
									class="h-5 w-5 rounded-full mt-0.5"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									viewBox="0 0 3900 3900"
									><path fill="#b22234" d="M0 0h7410v3900H0z" /><path
										d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
										stroke="#fff"
										stroke-width="300"
									/><path fill="#3c3b6e" d="M0 0h2964v2100H0z" /><g fill="#fff"
										><g id="d"
											><g id="c"
												><g id="e"
													><g id="b"
														><path
															id="a"
															d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
														/><use xlink:href="#a" y="420" /><use xlink:href="#a" y="840" /><use
															xlink:href="#a"
															y="1260"
														/></g
													><use xlink:href="#a" y="1680" /></g
												><use xlink:href="#b" x="247" y="210" /></g
											><use xlink:href="#c" x="494" /></g
										><use xlink:href="#d" x="988" /><use xlink:href="#c" x="1976" /><use
											xlink:href="#e"
											x="2470"
										/></g
									>
								</svg>
							</Button>
						</SidebarBottomNav>
					</SidebarGroup>
				</SidebarWrapper>
			</Sidebar>
		</Drawer>

		<div
			class="p-1 md:p-8 pt-20 md:pt-32 bg-slate-100 grow bg-[url('/bg.png')] bg-cover md:ml-72 min-h-screen overflow-auto"
		>
			<main class="rounded-lg p-2 md:p-4 bg-white flex flex-col space gap-10 shadow-md">
				<slot />
			</main>
		</div>
	</div>
</div>
