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
	};

	export function getUiShellContext(): uiShellContext {
		return getContext(UI_SHELL_KEY);
	}
</script>

<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let breakPoint: number;

	let width: number;
	let activateClickOutside = writable(false);
	let drawerHidden: Writable<boolean> = writable(false);
	let backdrop = writable(false);

	$: if (width >= breakPoint) {
		$drawerHidden = false;
		$activateClickOutside = false;
		$backdrop = false;
	} else {
		$drawerHidden = true;
		$activateClickOutside = true;
		$backdrop = true;
	}
	onMount(() => {
		if (width >= breakPoint) {
			$drawerHidden = false;
			$activateClickOutside = false;
			$backdrop = false;
		} else {
			$drawerHidden = true;
			$activateClickOutside = true;
			$backdrop = true;
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
		backdrop
	});
</script>

<svelte:window bind:innerWidth={width} />
<div class="w-screen h-screen overflow-hidden flex flex-col">
	<slot />
</div>
