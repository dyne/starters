<script lang="ts">
	import { Navbar, NavHamburger, Button, NavUl, NavLi } from 'flowbite-svelte';
	import { featureFlags } from '$lib/features';
	import { currentUser } from '$lib/pocketbase';

	export let toggleSide: () => void;

	let navDivClass =
		'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 flex items-center justify-between w-full lg:mx-auto py-1.5 px-4';
</script>

<Navbar
	fluid={true}
	navClass="px-2 sm:px-4 py-2 md:py-0 fixed w-full z-20 top-0 left-0 border-b"
	{navDivClass}
>
	<slot name="start">
		<NavHamburger
			on:click={toggleSide}
			btnClass="focus:outline-none whitespace-normal rounded-lg focus:ring-2 p-1.5 focus:ring-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 m-0 mr-3 lg:hidden"
		/>
		<div />
	</slot>
	<slot name="center">
		<div>
			<span>Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span></span>
			{#if $featureFlags.DID}
				<Button
					href="https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:{$currentUser?.eddsa_public_key}"
					target="_blank"
					size="xs"
					class="ml-3"
					color="light">My DID</Button
				>
			{/if}
		</div>
	</slot>
	<slot name="end">
		<div />
	</slot>
</Navbar>
