<script context="module" lang="ts">
	export const UI_SHELL_KEY = Symbol('usk');

	export type uiShellContext = {
		drawerHidden: Writable<boolean>;
		breakPoint: number;
		toggleSidebar: () => void;
		useDrawerLayout: Writable<boolean>;
	};

	export function getUiShellContext(): uiShellContext {
		return getContext(UI_SHELL_KEY);
	}
</script>

<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	/**
	 * The window width (px) at which the SideNav is expanded and the hamburger menu is hidden.
	 */
	export let sidebarWidthThreshold: number | undefined = undefined

	let width: number;
	let drawerHidden: Writable<boolean> = writable(false);
	let useDrawerLayout = writable(false);

	$: if (sidebarWidthThreshold && width >= sidebarWidthThreshold) {
		$drawerHidden = true;
		$useDrawerLayout = false;
	} else {
		$drawerHidden = true;
		$useDrawerLayout = true;
	}
	onMount(() => {
		if (sidebarWidthThreshold && width >= sidebarWidthThreshold) {
			$drawerHidden = true;
			$useDrawerLayout = false;
		} else {
			$drawerHidden = true;
			$useDrawerLayout = true;
		}
	});
	const toggleSidebar = () => {
		$drawerHidden = !$drawerHidden;
	};

	setContext(UI_SHELL_KEY, {
		drawerHidden,
		sidebarWidthThreshold,
		toggleSidebar,
		useDrawerLayout
	});
</script>

<svelte:window bind:innerWidth={width} />
<div class="w-screen h-screen overflow-hidden flex flex-col">
	<div class="shrink-0">
		<slot name="top" useDrawerLayout={$useDrawerLayout} />
	</div>
	<div class="h-0 grow flex items-stretch">
		<slot useDrawerLayout={$useDrawerLayout} />
	</div>
</div>

<!-- 
	@component 
	the shell provide the context to build the layout
	
	### Components using the shell context:
	- `sidebar` - the sidebar component
	- `navbar` - the navbar component
	- `bottomMenu` - the bottom menu component for the bottom of the sidebar
	- `hamburger` - the hamburger menu component (should be use in the navbar)
	- `didButton` - the did button component (if the flag `did` is set to true)
	- `avatarMenu` - the avatar menu component (should be use in the navbar)

	### Props
	- `sidebarWidthThreshold` - The window width (px) at which the SideNav is expanded and the hamburger menu is hidden. Default 1024

-->
