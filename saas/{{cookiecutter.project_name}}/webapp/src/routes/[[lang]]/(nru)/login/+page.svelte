<script lang="ts">
	import { goto } from '$lib/i18n';
	import { pb } from '@/pocketbase';
	import { Collections } from '@/pocketbase/types';
	import { Form, createForm, FormError, SubmitButton } from '@/forms';
	import { Field } from '@/forms/fields';
	import { z } from 'zod';
	import { currentEmail } from './+layout.svelte';
	import { zod } from 'sveltekit-superforms/adapters';

	const schema = z.object({
		email: z.string().email(),
		password: z.string()
	});

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async ({ form }) => {
			const { data } = form;
			const u = pb.collection('users');
			await u.authWithPassword(data.email, data.password);
			await goto('/my');
		},
		initialData: { email: $currentEmail },
		options: { taintedMessage: null }
	});

	const { form: formData } = form;

	$: $currentEmail = $formData.email;
</script>

<Form {form} submitButtonText="Log in">
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

	<Field
		{form}
		name="password"
		options={{
			id: 'password',
			type: 'password',
			label: 'Your password',
			placeholder: '•••••'
		}}
	/>
</Form>
