<script lang="ts">
	import { getUiShellContext } from './UiShell.svelte';
	import SidebarDrawerContainer from './SidebarDrawerContainer.svelte';
	import SidebarDefaultContainer from './SidebarDefaultContainer.svelte';
	import { Sidebar, SidebarWrapper } from 'flowbite-svelte';

	const { mobile } = getUiShellContext();

	/**
	 *If true the sidebar will be in a sidebarDrawerContainer in mobile mode
	 */
	export let responsive = true;

	export let width = 'sm:w-60 w-40';

	$: comp = $mobile && responsive ? SidebarDrawerContainer : SidebarDefaultContainer;
</script>

<svelte:component this={comp} {width}>
	<Sidebar class="flex flex-col grow" asideClass={width}>
		<div class="flex flex-col overflow-hidden grow">
			{#if $mobile && responsive}
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
	<!-- <SidebarNav {primaryMenu} {secondaryMenu} {bottomMenu} /> -->
</svelte:component>

<!-- 
	@component 

	### Props
	- `primaryMenu` - The primary menu items 
	- `secondaryMenu` - The secondary menu items 
	- `bottomMenu` - The bottom menu items 
	- `responsive` - If true the sidebar will be in a drawer in mobile mode, default **true**
-->
