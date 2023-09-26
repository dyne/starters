<script lang="ts">
	import { getUiShellContext, type MenuLink } from './UiShell.svelte';
	import Drawer from './Drawer.svelte';
	import SidebarNav from './SidebarNav.svelte';

	const { mobile } = getUiShellContext();

	/**
	 * The primary menu items
	 * type MenuLink
	 */
	export let primaryMenu: MenuLink[];
	/**
	 * The secondary menu items
	 * type MenuLink
	 */
	export let secondaryMenu: MenuLink[] | undefined = undefined;
	/**
	 * The bottom menu items
	 * type svelte component
	 */
	export let bottomMenu: ConstructorOfATypedSvelteComponent | null | undefined;
	/**
	 *If true the sidebar will be in a drawer in mobile mode
	 */
	export let responsive = true;
</script>

<div class="h-0 grow flex">
	<div class={$mobile ? 'pr-0 border-r-2' : 'pr-8 border-r-2'}>
		{#if $mobile && responsive}
			<Drawer>
				<SidebarNav {primaryMenu} {secondaryMenu} {bottomMenu} />
			</Drawer>
		{:else}
			<SidebarNav {primaryMenu} {secondaryMenu} {bottomMenu} />
		{/if}
	</div>
	<div class="p-1 lg:p-4 pt-8 lg:pt-16 bg-slate-100 grow bg-cover min-h-screen overflow-auto">
		<main class="rounded-lg bg-white flex flex-col shadow-md p-2 lg:p-8 pb-16 w-full">
			<slot />
		</main>
	</div>
</div>

<!-- 
	@component 

	### Props
	- `primaryMenu` - The primary menu items 
	- `secondaryMenu` - The secondary menu items 
	- `bottomMenu` - The bottom menu items 
	- `responsive` - If true the sidebar will be in a drawer in mobile mode, default **true**
-->
