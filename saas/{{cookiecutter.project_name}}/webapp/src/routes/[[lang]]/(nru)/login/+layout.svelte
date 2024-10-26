<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	export const currentEmail = writable('');
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { Link } from '@/components/types';
	import { featureFlags } from '@/features';
	import { m } from '@/i18n';
	import T from '@/components/custom/t.svelte';
	import { Button } from '@/components/ui/button';
	import Separator from '@/components/ui/separator/separator.svelte';
	import A from '@/components/custom/a.svelte';

	const modes: Link[] = [
		{
			href: '/login',
			text: m.Email_and_password()
		},
		{
			href: '/login/webauthn',
			text: m.Webauthn()
		}
	];
</script>

<T tag="h4">Log in</T>
{#if $featureFlags.WEBAUTHN}
	<div class="space-y-2">
		<T tag="small" class="text-gray-500">{m.Choose_your_authentication_method()}</T>
		<div class="flex items-center gap-2">
			{#each modes as { href, text }}
				{@const isActive = $page.url.pathname === href}
				<Button variant={isActive ? 'default' : 'outline'} {href} class="grow">{text}</Button>
			{/each}
		</div>
	</div>
{/if}

<div class="pt-4">
	<slot />
</div>

<div class="flex flex-col gap-4 space-y-2">
	<Separator />

	<T class="self-center text-gray-500 dark:text-gray-400" tag="small">
		{m.Dont_have_an_account()}
		<A href="/register">{m.Register_here()}</A>
	</T>
</div>
