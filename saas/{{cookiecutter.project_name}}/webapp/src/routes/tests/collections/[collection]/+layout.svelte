<script lang="ts">
	import { page } from '$app/stores';
	import { Collections } from '$lib/pocketbase-types';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	const collections = Object.values(Collections);
	$: activeUrl = $page.url.pathname;
</script>

<div class="w-screen h-screen overflow-hidden flex items-stretch">
	<Sidebar>
		<SidebarWrapper>
			<SidebarGroup>
				{#each collections as collection}
					{@const href = `/tests/collections/${collection}`}
					<SidebarItem active={href == activeUrl} {href} label={collection} />
				{/each}
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<div class="grow overflow-y-auto">
		<slot />
	</div>
</div>
