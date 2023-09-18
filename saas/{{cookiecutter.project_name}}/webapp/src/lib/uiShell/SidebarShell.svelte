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
	export let secondaryMenu: MenuLink[];
	/**
	 * The logo image
	 */
	export let logo = '/logo.svg';
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

<div class="w-screen h-screen overflow-hidden flex flex-col">
	<div class="h-0 grow flex">
		<div class={$mobile && responsive? "pr-0" : "pr-12"}>
			{#if $mobile && responsive}
				<Drawer>
					<SidebarNav {bottomMenu} />
				</Drawer>
			{:else}
				<SidebarNav {bottomMenu} />
			{/if}
		</div>
		<div
			class="p-1 lg:p-8 pt-20 lg:pt-32 bg-slate-100 grow bg-[url('/bg.png')] bg-cover min-h-screen overflow-auto"
		>
			<main class="rounded-lg p-2 md:p-4 bg-white flex flex-col space gap-10 shadow-md">
				<slot />
			</main>
		</div>
	</div>
</div>

<!-- 
	@component 

	### Props
	- `primaryMenu` - The primary menu items 
	- `secondaryMenu` - The secondary menu items 
	- `logo` - The logo image
	- `bottomMenu` - The bottom menu items 
	- `responsive` - If true the sidebar will be in a drawer in mobile mode, default **true**
-->
