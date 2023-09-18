<script context="module" lang="ts">
	export interface MenuLink {
		label: string;
		href?: string;
		icon?: ConstructorOfATypedSvelteComponent | null | undefined;
		subMenu?: MenuLink[];
	}

	export const UI_SHELL_KEY = Symbol('usk');

	export type uiShellContext = {
		drawerHidden: Writable<boolean>;
		topMenu: MenuLink[];
		breakPoint: number;
		activateClickOutside: Writable<boolean>;
		toggleSide: () => void;
		backdrop: Writable<boolean>;
		mobile: Writable<boolean>;
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
	export let breakPoint: number;

	let width: number;
	let activateClickOutside = writable(false);
	let drawerHidden: Writable<boolean> = writable(false);
	let backdrop = writable(false);
	let mobile = writable(false);

	$: if (width >= breakPoint) {
		$drawerHidden = false;
		$activateClickOutside = false;
		$backdrop = false;
		$mobile = false
	} else {
		$drawerHidden = true;
		$activateClickOutside = true;
		$backdrop = true;
		$mobile = true
	}
	onMount(() => {
		if (width >= breakPoint) {
			$drawerHidden = false;
			$activateClickOutside = false;
			$backdrop = false;
			$mobile = false
		} else {
			$drawerHidden = true;
			$activateClickOutside = true;
			$backdrop = true;
			$mobile = true
		}
	});
	const toggleSide = () => {
		if (width < breakPoint) {
			$drawerHidden = !$drawerHidden;
		}
	};

	setContext(UI_SHELL_KEY, {
		drawerHidden,
		topMenu: [],
		breakPoint,
		activateClickOutside,
		toggleSide,
		backdrop,
		mobile
	});
</script>

<svelte:window bind:innerWidth={width} />
<div class="w-screen h-screen overflow-hidden flex flex-col">
	<slot />
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
	- `breakPoint` - The window width (px) at which the SideNav is expanded and the hamburger menu is hidden. Default 1024

-->
