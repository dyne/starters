<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase-types';
	import { goto } from '$app/navigation';
	import { features, featuresNames, isFeatureActive } from '$lib/features';
	import { z } from 'zod';
	import { currentEmail } from './+layout.svelte';

	// Components
	import { A, Heading } from 'flowbite-svelte';
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import Checkbox from '$lib/components/forms/checkbox.svelte';
	import FormError from '$lib/components/forms/formError.svelte';
	import SubmitButton from '$lib/components/forms/submitButton.svelte';

	//

	const schema = z
		.object({
			email: z.string().email(),
			password: z.string().min(8),
			passwordConfirm: z.string().min(8),
			acceptTerms: z.boolean()
		})
		.refine((data) => data.password === data.passwordConfirm, 'PASSWORDS_DO_NOT_MATCH');

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const u = pb.collection(Collections.Users);
			await u.create(data);
			await u.authWithPassword(data.email, data.password);
			await u.requestVerification(data.email);
			if (isFeatureActive($features, featuresNames.KEYPAIROOM)) {
				await goto('/keypairoom');
			} else {
				await goto('/my');
			}
		},
		{ email: $currentEmail },
		{ taintedMessage: null }
	);
	const keys = schema.innerType().keyof().Enum;

	const { capture, restore, form } = superform;
	export const snapshot = { capture, restore };

	$: $currentEmail = $form.email;
</script>

<Form {superform}>
	<Input type="email" label="Your email" field={keys.email} placeholder="name@example.org" />
	<Input type="password" label="Your password" field={keys.password} placeholder="•••••" />
	<Input
		type="password"
		label="Confirm password"
		field={keys.passwordConfirm}
		placeholder="•••••"
	/>
	<Checkbox field={keys.acceptTerms}>
		I accept the<A class="ml-1" href="/">Terms and Conditions</A>
	</Checkbox>

	<FormError />
	<div class="flex justify-end">
		<SubmitButton>Create an account</SubmitButton>
	</div>
</Form>
