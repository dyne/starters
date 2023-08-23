<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	export const currentEmail = writable('');
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { Link } from '$lib/utils/types';
	import { Button, ButtonGroup, Heading } from 'flowbite-svelte';

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
<ButtonGroup class="w-full">
	{#each modes as { href, text }}
		{@const isActive = $page.url.pathname === href}
		<Button color={isActive ? 'dark' : 'alternative'} {href} class="grow">{text}</Button>
	{/each}
</ButtonGroup>

<div class="pt-4">
	<slot />
</div>
