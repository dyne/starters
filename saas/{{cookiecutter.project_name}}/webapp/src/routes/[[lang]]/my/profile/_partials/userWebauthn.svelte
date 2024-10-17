<script lang="ts">
	import {
		registerUser,
		isWebauthnSupported,
		isPlatformAuthenticatorAvailable
	} from '$lib/webauthn';
	import { currentUser } from '@/pocketbase';

	import { Collections, type WebauthnCredentialsResponse } from '@/pocketbase/types';
	import { CollectionManager, DeleteRecord, EditRecord } from '$lib/collectionManager';

	import { createTypeProp } from '$lib/utils/typeProp';
	import T from '@/components/custom/t.svelte';
	import { m } from '$lib/i18n';

	import Separator from '@/components/ui/separator/separator.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Icon from '@/components/custom/icon.svelte';
	import { Plus, Info } from 'lucide-svelte';
	import Card from '@/components/custom/card.svelte';
	import Spinner from '@/components/custom/spinner.svelte';
	import Alert from '@/components/custom/alert.svelte';

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
				<Card>
					<div class="flex items-center justify-between gap-4">
						<div class="w-0 grow overflow-hidden">
							<T>{label}</T>
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
		<div class="flex flex-col items-center gap-2">
			<Spinner />
			<T>{m.Checking_your_device()}</T>
		</div>
	{:then response}
		{#if !response || !isWebauthnSupported()}
			<Alert variant="warning" icon={Info} let:Description>
				<Description>
					{m.Your_device_does_not_have_integrated_Webauthn_support_An_external_authenticator_is_required_()}
				</Description>
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
