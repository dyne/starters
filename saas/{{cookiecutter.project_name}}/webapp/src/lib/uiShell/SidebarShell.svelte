<script lang="ts">
	import { getUiShellContext, type MenuLink } from './UiShell.svelte';
	import Drawer from './Drawer.svelte';
	import Test from './test.svelte';
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

	$: comp = $mobile && responsive ? Drawer : Test;
</script>

<svelte:component this={comp}>
	<SidebarNav {primaryMenu} {secondaryMenu} {bottomMenu} />
</svelte:component>

<!-- 
	@component 

	### Props
	- `primaryMenu` - The primary menu items 
	- `secondaryMenu` - The secondary menu items 
	- `bottomMenu` - The bottom menu items 
	- `responsive` - If true the sidebar will be in a drawer in mobile mode, default **true**
-->
