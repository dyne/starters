<script lang="ts">
	import { currentUser } from '@/pocketbase';
	import { Logo, Topbar, HamburgerButton, UiShell } from '@/components/layout';
	import { m } from '@/i18n';
	import { getUserDisplayName } from '@/pocketbase/utils';

	import MySidebar from './_partials/mySidebar.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let sidebarLayoutBreakpoint = 1024;
</script>

<UiShell {sidebarLayoutBreakpoint}>
	{#snippet top({ sidebarMode })}
	
			{#if sidebarMode == 'drawer'}
				<Topbar>
					{#snippet left()}
							
							<Logo />
						
							{/snippet}
					{#snippet center()}
							
							<div class="flex items-center">
								{#if $currentUser}
									<span class="whitespace-nowrap">
										{m.hello()},
										<span class="text-primary-600 font-semibold">
											{getUserDisplayName($currentUser)}
										</span>
									</span>
								{/if}
							</div>
						
							{/snippet}

					{#snippet right()}
								<HamburgerButton  />
							{/snippet}
				</Topbar>
			{/if}
		
	{/snippet}

	{#snippet sidebar()}
	
			<MySidebar />
		
	{/snippet}

	{@render children?.()}
</UiShell>
