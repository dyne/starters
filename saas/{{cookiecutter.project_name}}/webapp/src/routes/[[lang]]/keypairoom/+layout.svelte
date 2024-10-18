<script>
	import { Logo, Topbar } from '$lib/layout';
	import { currentUser } from '@/pocketbase';
	import DIDButton from '$lib/components/DIDButton.svelte';
	import UserAvatar from '@/components/custom/userAvatar.svelte';
	import { m } from '$lib/i18n';
	import { featureFlags } from '$lib/features';
	import { Button } from '@/components/ui/button';
</script>

<Topbar>
	<Logo slot="left" />
	<div class="flex items-center" slot="center">
		{#if $featureFlags.AUTH}
			<div>
				<span class="whitespace-nowrap">
					Hello, <span class="font-semibold">{$currentUser?.email}</span>
				</span>
			</div>
			<div class="shrink-0">
				<DIDButton />
			</div>
		{:else}
			<div>Hello!</div>
		{/if}
	</div>
	<div slot="right" class="flex items-center gap-4">
		{#if $featureFlags.AUTH}
			<Button data-sveltekit-preload-data="off" href="/logout" size="sm" color="alternative">
				{m.Sign_out()}
			</Button>
			<UserAvatar />
		{/if}
	</div>
</Topbar>
<div class="mx-auto max-w-md p-6">
	<slot />
</div>
