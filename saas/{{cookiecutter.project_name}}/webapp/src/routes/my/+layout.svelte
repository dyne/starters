<script lang="ts">
	import { currentUser } from '@/pocketbase';
	import { Logo, Topbar, HamburgerButton, UiShell } from '@/components/layout';
	import { m } from '@/i18n';
	import { getUserDisplayName } from '@/pocketbase/utils';
	import * as Sidebar from '@/components/ui/sidebar/index.js';

	import MySidebar from './_partials/mySidebar.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let sidebarLayoutBreakpoint = 1024;
</script>

<Sidebar.Provider>
	<MySidebar />
	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
	<!-- TODO - Handle topbar -->
</Sidebar.Provider>
