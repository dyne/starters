<script lang="ts" context="module">
	export type SidebarLayoutMode = 'default' | 'drawer';
</script>

<script lang="ts">
	import { getUIShellContext } from './UIShell.svelte';
	import SidebarDefaultContainer from './SidebarDefaultContainer.svelte';
	import SidebarDrawerContainer from './SidebarDrawerContainer.svelte';
	import { Sidebar } from 'flowbite-svelte';

	const { sidebarLayoutMode } = getUIShellContext();

	export let width = 'w-60';

	$: comp = $sidebarLayoutMode == 'drawer' ? SidebarDrawerContainer : SidebarDefaultContainer;
</script>

<svelte:component this={comp} {width}>
	<Sidebar class="flex flex-col grow" asideClass={width}>
		<div class="flex flex-col overflow-hidden grow">
			{#if $sidebarLayoutMode == 'drawer'}
				<div class="shrink-0">
					<slot name="top" />
				</div>
			{/if}
			<div class="h-0 grow">
				<slot />
			</div>
			<div class="shrink-0">
				<slot name="bottom" />
			</div>
		</div>
	</Sidebar>
</svelte:component>
