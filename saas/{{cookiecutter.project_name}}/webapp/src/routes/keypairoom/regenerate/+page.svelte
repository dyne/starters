<script lang="ts">
	import { getHMAC, regenerateKeypair, saveKeyringToLocalStorage } from '$lib/keypairoom/keypair';
	import { A, Heading, P } from 'flowbite-svelte';
	import Input from '$lib/components/forms/input.svelte';

	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Textarea from '$lib/components/forms/textarea.svelte';
	import { z } from 'zod';
	import { currentUser } from '$lib/pocketbase.js';

	//

	let success = false;

	const schema = z.object({
		email: z.string().email(),
		seed: z.string()
	});

	const superform = createForm(schema, async ({ form }) => {
		const hmac = await getHMAC(form.data.email);
		const keypair = await regenerateKeypair(form.data.seed, hmac);
		saveKeyringToLocalStorage(keypair.keyring);
		success = true;
	});
	const keys = schema.keyof().Enum;

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	if ($currentUser) $form.email = $currentUser.email;

	const textAreaPlaceholder =
		'skin buyer sunset person run push elevator under debris soft surge man';
</script>

{#if !success}
	<Form {superform} defaultSubmitButtonText="Regenerate keys">
		<Heading tag="h4">Regenerate keys</Heading>
		<div>
			<P>You've been redirected here because your private keys are missing.</P>
			<P>Please type here your email and seed</P>
		</div>
		{#if !$currentUser}
			<div class="space-y-1">
				<Input field="email" label="User email" />
				<P size="sm" color="text-gray-400">
					Your email won't be stored anywhere, it will be used only to generate the keys.
				</P>
			</div>
		{/if}
		<Textarea field={keys.seed} placeholder={textAreaPlaceholder} />
	</Form>
	<A href="/keypairoom">Forgot the seed? Regenerate it</A>
{:else}
	<div class="space-y-4 p-6 flex flex-col">
		<Heading tag="h4">Keys regenerated!</Heading>
		<P>
			Your keys have been regenerated. You can now go back to
			<A href="/my">your profile</A>.
		</P>
	</div>
{/if}
