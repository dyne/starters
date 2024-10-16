<script lang="ts">
	import { goto } from '$lib/i18n';
	import { loginUser } from '$lib/webauthn/index';
	import { z } from 'zod';

	import { Form, createForm, FormError, SubmitButton } from '@/forms';
	import { Field } from '@/forms/fields';
	import { currentEmail } from '../+layout.svelte';
	import { zod } from 'sveltekit-superforms/adapters';

	const schema = z.object({
		email: z.string().email()
	});

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async ({ form }) => {
			const { data } = form;
			await loginUser(data.email);
			await goto('/my');
		},
		initialData: { email: $currentEmail },
		options: { taintedMessage: null }
	});

	const { form: formData } = form;

	$: $currentEmail = $formData.email;
</script>

<Form {form}>
	<Field
		{form}
		name="email"
		options={{
			id: 'email',
			type: 'email',
			label: 'Your email',
			placeholder: 'name@foundation.org'
		}}
	/>

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>Log in with webauthn</SubmitButton>
	</div>
</Form>
