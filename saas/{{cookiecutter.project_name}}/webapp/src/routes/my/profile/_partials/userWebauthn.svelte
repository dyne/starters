<script lang="ts">
	import { registerUser, isWebauthnSupported } from '$lib/webauthn';
	import { currentUser } from '$lib/pocketbase';

	import { Alert, Button, Card, Heading, P } from 'flowbite-svelte';
	import { InformationCircle, Plus } from 'svelte-heros-v2';
	import RecordsManager from '$lib/schema/recordsManager/recordsManager.svelte';
	import { Collections } from '$lib/pocketbase-types';
	import DeleteRecord from '$lib/schema/recordsManager/recordActions/deleteRecord.svelte';
</script>

<Heading tag="h6">Your devices</Heading>
<P color="gray" size="sm">Manage the devices you use to login.</P>

<RecordsManager collection={Collections.WebauthnCredentials} let:records>
	<div class="space-y-2 py-4">
		{#each records as record}
			<Card class="max-w-none">
				<div class="flex justify-between gap-4 items-center">
					<div class="w-0 grow overflow-hidden">
						<P>{record.credential.ID}</P>
					</div>
					<DeleteRecord {record} />
				</div>
			</Card>
		{/each}
	</div>
</RecordsManager>

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
