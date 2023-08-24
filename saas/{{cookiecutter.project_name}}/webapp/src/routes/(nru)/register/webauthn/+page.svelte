<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginUser, registerUser } from '$lib/webauthn/index';
	import { z } from 'zod';

	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import FormError from '$lib/components/forms/formError.svelte';
	import SubmitButton from '$lib/components/forms/submitButton.svelte';
	import { currentEmail } from '../+layout.svelte';
	import { features, featuresNames, isFeatureActive } from '$lib/features';
	import { Collections } from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase';
	import { A, Checkbox, P } from 'flowbite-svelte';

	const schema = z.object({
		email: z.string().email(),
		acceptTerms: z.boolean()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const { email } = data;
			await registerUser(email);
			await pb.collection(Collections.Users).requestVerification(email);
			alert('You will be now asked to login with your webauthn device');
			await loginUser(email);
			if (isFeatureActive($features, featuresNames.KEYPAIROOM)) {
				await goto('/keypairoom');
			} else {
				await goto('/my');
			}
		},
		{ email: $currentEmail },
		{ taintedMessage: null }
	);
	const keys = schema.keyof().Enum;

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	$: $currentEmail = $form.email;
</script>

<Form {superform}>
	<Input
		id="email"
		type="email"
		label="Your email"
		field={keys.email}
		placeholder="name@example.org"
	/>
	<Checkbox field={keys.acceptTerms}>
		I accept the<A class="ml-1" href="/">Terms and Conditions</A>
	</Checkbox>

	<FormError />
	<div class="flex justify-end">
		<SubmitButton>Register with webauthn</SubmitButton>
	</div>
</Form>
