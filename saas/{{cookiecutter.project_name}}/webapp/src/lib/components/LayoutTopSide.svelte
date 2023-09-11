
<script context="module" lang="ts">
	export interface MenuLink {
        label: string,
        href?: string,
        icon?: ConstructorOfATypedSvelteComponent | null | undefined,
        subMenu?: MenuLink[]
    }
</script>
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SidebarMenu from '$lib/components/SidebarMenu.svelte';
	import Navbar from"$lib/components/NavbarMenu.svelte";


	export let breakPoint: number = 1024;
	export let width: number;
	export let primaryMenu:MenuLink[]
	export let secondaryMenu:MenuLink[]



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
    <Navbar
	{breakPoint}
	{width}
	/>		
	<SidebarMenu 
	{breakPoint}
	{primaryMenu}
	{secondaryMenu}
	{width}/>
</div>
