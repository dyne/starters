<script context="module" lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	export const UI_SHELL_KEY = Symbol('usk');

	export type UIShellContext = {
		drawerHidden: Writable<boolean>;
		breakPoint: number;
		toggleSidebar: () => void;
		useDrawerLayout: Writable<boolean>;
	};

	export function getUIShellContext(): UIShellContext {
		return getContext(UI_SHELL_KEY);
	}
</script>

<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	/**
	 * The window width (px) at which the SideNav is expanded and the hamburger menu is hidden.
	 */
	export let sidebarWidthThreshold: number | undefined = undefined;

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
