<script lang="ts">
	import Checkbox from '$lib/components/forms/checkbox.svelte';
	import FileInput from '$lib/components/forms/file.svelte';
	import Form, { createForm, createFormData } from '$lib/components/forms/form.svelte';
	import FormError from '$lib/components/forms/formError.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import SubmitButton from '$lib/components/forms/submitButton.svelte';
	import { features, featuresNames, getFeatureByName, isFeatureActive } from '$lib/features';
	import { destroyKeyring, getKeyringFromLocalStorage } from '$lib/keypairoom/keypair';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Alert } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { zencode_exec } from 'zenroom';
	import deactivate_did from '/zenflows-crypto/src/deactivate_did.zen?raw';
	import { z } from 'zod';

	let error: string | null = null;

	const dispatch = createEventDispatcher<{ success: {} }>();

	const schema = z.object({
		name: z.string().min(3).optional(),
		email: z.string().email().optional(),
		emailVisibility: z.boolean().optional(),
		avatar: z
			.instanceof(File)
			.refine((file) => file.type === 'image/png' || file.type === 'image/jpeg')
			.refine((file) => file.size < 1024 * 1024 * 2)
			.optional()
	});

	const initialData: z.infer<typeof schema> = {
		name: $currentUser!.name,
		email: $currentUser!.email,
		emailVisibility: $currentUser!.emailVisibility
	};
	const disableDID = async () => {
		const didVariables = getFeatureByName($features, featuresNames.DID)?.envVariables;
		//@ts-ignore
		const didSpec = didVariables?.DID_SPEC;
		const keyring = getKeyringFromLocalStorage();
		if (!keyring) {
			return;
		}
		const data = {
			keyring,
			signer_did_spec: didSpec,
			eddsa_public_key: $currentUser!.eddsa_public_key,
			did_spec: didSpec
		};
		const { result } = await zencode_exec(deactivate_did, { data: JSON.stringify(data) });
		const response = await fetch('/api/deactivateDid/', {
			method: 'POST',
			body: JSON.stringify({ data: JSON.parse(result) }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.status !== 200) {
			throw new Error('Error deactivating DID');
		}
	};

	const superform = createForm(
		schema,
		async ({ form }) => {
			const formData = createFormData(form.data);
			let email = formData.get('email') as string;
			$currentUser = await pb.collection('users').update($currentUser!.id, {
				name: formData.get('name'),
				emailVisibility: formData.get('emailVisibility')
			});
			let emailChangeSent = false;
			if (isEmailChanged) {
				email = formData.get('email') as string;
				emailChangeSent = await pb.collection('users').requestEmailChange(email);
			}
			if (keypairoomActive && isEmailChanged && emailChangeSent) {
				alert(
					'Email change request sent. Please check your email and click on the link to confirm the change.Your keys will be destroyed and you will need to recreate them.'
				);
				try {
					await disableDID();
				} catch (error) {
					console.error(error);
					error = 'Error deactivating DID';
					return;
				}
				destroyKeyring();
				pb.collection('users').update($currentUser!.id, {
					ethereum_address: null,
					ecdh_public_key: null,
					eddsa_public_key: null,
					reflow_public_key: null,
					bitcoin_public_key: null
				});
			} 
			dispatch('success');
		},
		initialData
	);
	const { form } = superform;
	let isEmailChanged = false;

	const keypairoomActive = isFeatureActive($features, featuresNames.KEYPAIROOM);

	$: {
		if ($form.email !== $currentUser?.email) {
			isEmailChanged = true;
		} else {
			isEmailChanged = false;
		}
	}
</script>

<Form {superform}>
	<Input field="name" label="Username" />

	<div class="space-y-2">
		<Input field="email" />
		<Checkbox field="emailVisibility">
			<span>Show email to other users</span>
		</Checkbox>
	</div>

	<FileInput field="avatar" />

	<FormError />

	<div>
		{#if isEmailChanged && keypairoomActive}
			<Alert>
				<span class="font-medium">Email is changed!</span> If you change your email, you will need to
				regenerate your keys too.
			</Alert>
		{/if}
		{#if error}
			<Alert type="error">
				<span class="font-medium">Error!</span>
				{error}
			</Alert>
		{/if}
		<div class="flex justify-end mt-1">
			<SubmitButton>Update profile</SubmitButton>
		</div>
	</div>
</Form>
