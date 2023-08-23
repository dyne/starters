<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	export const currentEmail = writable('');
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import FeatureFlag from '$lib/components/featureFlag.svelte';
	import type { Link } from '$lib/utils/types';
	import { A, Button, ButtonGroup, Heading, Hr, P } from 'flowbite-svelte';
	import { featuresNames } from '$lib/features';

	const modes: Link[] = [
		{
			href: '/register',
			text: 'Email and password'
		},
		{
			href: '/register/webauthn',
			text: 'Webauthn'
		}
	];

	$: loginHref = $page.url.pathname.includes('webauthn') ? '/login/webauthn' : '/login';
</script>

<Heading tag="h4">Create an account</Heading>
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

<div class="flex flex-col items-center gap-4">
	<Hr />
	<P color="text-gray-500 dark:text-gray-400" size="sm">
		Already have an account?
		<A href={loginHref}>Login here</A>
	</P>
</div>
