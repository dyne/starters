<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	export const currentEmail = writable('');
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import FeatureFlag from '$lib/components/featureFlag.svelte';
	import type { Link } from '$lib/utils/types';
	import { Button, ButtonGroup, Heading, P } from 'flowbite-svelte';
	import { featuresNames } from '$lib/features';

	const modes: Link[] = [
		{
			href: '/login',
			text: 'Email and password'
		},
		{
			href: '/login/webauthn',
			text: 'Webauthn'
		}
	];
</script>

<Heading tag="h4">Log in</Heading>
<FeatureFlag flag={featuresNames.WEBAUTHN}>
	<div class="space-y-2">
		<P size="sm" color="text-gray-500">Choose your authentication method</P>
		<ButtonGroup class="w-full">
			{#each modes as { href, text }}
				{@const isActive = $page.url.pathname === href}
				<Button color={isActive ? 'dark' : 'alternative'} {href} class="grow">{text}</Button>
			{/each}
		</ButtonGroup>
	</div>
</FeatureFlag>

<div class="pt-4">
	<slot />
</div>
