<script context="module" lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { SidebarLayoutMode } from './Sidebar.svelte';

	export const UI_SHELL_KEY = Symbol('usk');

	export type UIShellContext = {
		drawerHidden: Writable<boolean>;
		toggleSidebar: () => void;
		sidebarLayoutMode: Writable<SidebarLayoutMode>;
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
	export let sidebarLayoutBreakpoint: number | undefined = undefined;

	let width: number;

	let drawerHidden: Writable<boolean> = writable(false);
	const sidebarLayoutMode = writable<SidebarLayoutMode>('default');

	$: if (sidebarLayoutBreakpoint && width >= sidebarLayoutBreakpoint) {
		$drawerHidden = true;
		$sidebarLayoutMode = 'default';
	} else {
		$drawerHidden = true;
		$sidebarLayoutMode = 'drawer';
	}

	onMount(() => {
		if (sidebarLayoutBreakpoint && width >= sidebarLayoutBreakpoint) {
			$drawerHidden = true;
			$sidebarLayoutMode = 'default';
		} else {
			$drawerHidden = true;
			$sidebarLayoutMode = 'drawer';
		}
	});

	const toggleSidebar = () => {
		$drawerHidden = !$drawerHidden;
	};

	setContext(UI_SHELL_KEY, {
		drawerHidden,
		toggleSidebar,
		sidebarLayoutMode
	});
</script>

<svelte:window bind:innerWidth={width} />
<div class="w-screen h-screen overflow-hidden flex flex-col">
	<div class="shrink-0">
		<slot name="top" sidebarLayoutMode={$sidebarLayoutMode} />
	</div>
	<div class="h-0 grow flex items-stretch">
		<slot sidebarLayoutMode={$sidebarLayoutMode} />
	</div>
</div>
