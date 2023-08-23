<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginUser } from '$lib/webauthn/index';
	import { z } from 'zod';

	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import { Heading } from 'flowbite-svelte';
	import Input from '$lib/components/forms/input.svelte';
	import FormError from '$lib/components/forms/formError.svelte';
	import SubmitButton from '$lib/components/forms/submitButton.svelte';
	import { currentEmail } from '../+layout.svelte';

	const schema = z.object({
		email: z.string().email()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			await loginUser(data.email);
			await goto('/my');
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
		placeholder="name@foundation.org"
	/>
	<FormError />
	<div class="flex justify-end">
		<SubmitButton>Log in with webauthn</SubmitButton>
	</div>
</Form>
