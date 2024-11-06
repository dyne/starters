<script module lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	//

	type SidebarMode = 'default' | 'drawer';

	export const UI_SHELL_KEY = Symbol('usk');

	export type UIShellContext = {
		showSidebar: Writable<boolean>;
		toggleSidebar: () => void;
		sidebarMode: Writable<SidebarMode>;
	};

	export function getUIShellContext(): UIShellContext {
		return getContext(UI_SHELL_KEY);
	}
</script>

<script lang="ts">
	import { run } from 'svelte/legacy';

	import * as Sheet from '@/components/ui/sheet';
	import * as Resizable from '@/components/ui/resizable';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createToggleStore } from '@/components/custom/utils';
	import { onNavigate } from '$app/navigation';

	interface Props {
		sidebarLayoutBreakpoint?: number | undefined;
		top?: import('svelte').Snippet<[any]>;
		sidebar?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { sidebarLayoutBreakpoint = undefined, top, sidebar, children }: Props = $props();

	let windowWidth = $state(0);

	const showSidebar = createToggleStore(false);
	const sidebarMode = writable<SidebarMode>('default');

	run(() => {
		if (sidebarLayoutBreakpoint && windowWidth && windowWidth >= sidebarLayoutBreakpoint) {
			$sidebarMode = 'default';
		} else {
			$sidebarMode = 'drawer';
		}
	});

	function toggleSidebar() {
		if ($sidebarMode == 'drawer') showSidebar.toggle();
	}

	function closeSidebar() {
		if ($sidebarMode == 'drawer') showSidebar.off();
	}

	setContext<UIShellContext>(UI_SHELL_KEY, {
		showSidebar,
		toggleSidebar,
		sidebarMode
	});

	onNavigate(closeSidebar);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<Resizable.PaneGroup direction="vertical" class="!h-screen !w-screen">
	<div class="shrink-0">
		{@render top?.({ sidebarMode: $sidebarMode, toggleSidebar })}
	</div>

	<Resizable.PaneGroup direction="horizontal">
		{#if $sidebarMode == 'drawer'}
			<Sheet.Root bind:open={$showSidebar}>
				<Sheet.Content side="left" class="!p-0">
					{@render sidebar?.()}
				</Sheet.Content>
			</Sheet.Root>
		{/if}

		{#if $sidebarMode == 'default'}
			<div class="h-full w-60 overflow-hidden border-r">
				{@render sidebar?.()}
			</div>
		{/if}

		<Resizable.Pane>
			<main class="h-full overflow-scroll">{@render children?.()}</main>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</Resizable.PaneGroup>
