<script lang="ts">
	import { Topbar } from '@/components/layout';
	import { currentUser } from '@/pocketbase';
	import DIDButton from '@/did/DIDButton.svelte';
	import UserAvatar from '@/components/ui-custom/userAvatar.svelte';
	import { m } from '@/i18n';
	import { featureFlags } from '@/features';
	import { Button } from '@/components/ui/button';
	import { AppLogo } from '@/brand';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<Topbar>
	{#snippet left()}
		<AppLogo />
	{/snippet}
	{#snippet center()}
		<div class="flex items-center">
			{#if $featureFlags.AUTH}
				<div>
					<span class="whitespace-nowrap">
						Hello, <span class="font-semibold">{$currentUser?.email}</span>
					</span>
				</div>
				<div class="shrink-2 ml-4">
					<DIDButton />
				</div>
			{:else}
				<div>Hello!</div>
			{/if}
		</div>
	{/snippet}
	{#snippet right()}
		<div class="flex items-center gap-4">
			{#if $featureFlags.AUTH}
				<Button data-sveltekit-preload-data="off" href="/logout" size="sm" variant="outline">
					{m.Sign_out()}
				</Button>
				<UserAvatar />
			{/if}
		</div>
	{/snippet}
</Topbar>
<div class="mx-auto max-w-md p-6">
	{@render children?.()}
</div>
