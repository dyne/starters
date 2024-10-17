<script lang="ts">
	import {
		registerUser,
		isWebauthnSupported,
		isPlatformAuthenticatorAvailable
	} from '$lib/webauthn';
	import { currentUser } from '@/pocketbase';

	import { Collections, type WebauthnCredentialsResponse } from '@/pocketbase/types';
	import { CollectionManager, DeleteRecord, EditRecord } from '$lib/collectionManager';

	import { InformationCircle } from 'svelte-heros-v2';
	import { Alert, Card, Heading, P, Spinner } from 'flowbite-svelte';
	import { createTypeProp } from '$lib/utils/typeProp';
	import T from '@/components/custom/t.svelte';
	import { m } from '$lib/i18n';

	import Separator from '@/components/ui/separator/separator.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { Plus } from 'lucide-svelte';

	const platformAuthenticatorAvailable = isPlatformAuthenticatorAvailable();
	const recordType = createTypeProp<WebauthnCredentialsResponse<{ ID: string }>>();

	const userEmailAddress = $currentUser?.email!;
</script>

<div class="space-y-4">
	<div class="space-y-1">
		<T tag="h4">{m.Your_devices()}</T>
		<T>{m.Manage_the_devices_you_use_to_login_()}</T>
	</div>

	<Separator></Separator>

	<CollectionManager
		{recordType}
		collection={Collections.WebauthnCredentials}
		let:records
		editFormSettings={{ exclude: ['user', 'credential'] }}
	>
		<div class="space-y-2 py-4">
			{#each records as record}
				{@const label = Boolean(record.description) ? record.description : record.credential?.ID}
				<Card class="max-w-none">
					<div class="flex items-center justify-between gap-4">
						<div class="w-0 grow overflow-hidden">
							<P>{label}</P>
						</div>
						<div class="flex gap-2">
							<EditRecord {record} />
							<DeleteRecord {record} />
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</CollectionManager>

	{#await platformAuthenticatorAvailable}
		<div class="flex flex-col items-center">
			<Spinner />
			<P>Checking your device</P>
		</div>
	{:then response}
		{#if !response || !isWebauthnSupported()}
			<Alert color="yellow" class="mt-2">
				<svelte:fragment slot="icon">
					<InformationCircle />
				</svelte:fragment>
				<span>
					Your device does not have integrated Webauthn support. An external authenticator is
					required.
				</span>
			</Alert>
		{/if}
	{/await}

	<div class="mt-2 flex justify-end">
		<Button
			variant="outline"
			on:click={() => {
				registerUser(userEmailAddress, navigator.userAgent);
			}}
		>
			<Icon src={Plus} mr />
			{m.Add_a_device()}
		</Button>
	</div>
</div>
