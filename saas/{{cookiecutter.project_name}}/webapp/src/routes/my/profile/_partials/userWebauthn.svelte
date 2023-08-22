<script lang="ts">
	import { registerUser, isWebauthnSupported } from '$lib/webauthn';
	import { currentUser } from '$lib/pocketbase';

	import { Alert, Button, Heading, P } from 'flowbite-svelte';
	import { InformationCircle, Plus } from 'svelte-heros-v2';
	// import { onMount } from 'svelte';

	// onMount(async () => {
	// 	console.log(await navigator.credentials.get());
	// });
</script>

<Heading tag="h6">Your devices</Heading>
<P color="gray" size="sm">Manage the devices you use to login.</P>

{#if !isWebauthnSupported()}
	<Alert color="red" class="mt-2">
		<svelte:fragment slot="icon">
			<InformationCircle />
		</svelte:fragment>
		<span>
			Your browser does not support Webauthn. Please use a modern browser like Chrome, Firefox,
			Safari or Edge.
		</span>
	</Alert>
{:else}
	<div class="flex justify-end mt-2">
		<Button
			color="alternative"
			on:click={() => {
				registerUser($currentUser?.email);
			}}
		>
			<Plus size="20" class="mr-1" /> Add this device
		</Button>
	</div>
{/if}
