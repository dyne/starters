<script lang="ts">
	import { m } from '$lib/i18n';
	import { Form, createForm } from '@/forms';
	import { Field, FileField, CheckboxField } from '@/forms/fields';

	import { currentUser, pb } from '@/pocketbase';
	import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
	import { createEventDispatcher } from 'svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	//

	const dispatch = createEventDispatcher<{ success: undefined }>();

	const schema = createCollectionZodSchema('users').extend({
		email: z.string().email(),
		emailVisibility: z.boolean()
	});

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async ({ form }) => {
			$currentUser = await pb.collection('users').update($currentUser!.id, form.data);
			dispatch('success');
		},
		initialData: {
			name: $currentUser!.name,
			email: $currentUser!.email,
			emailVisibility: $currentUser!.emailVisibility
		},
		options: {
			dataType: 'form'
		}
	});
</script>

<Form {form} submitButtonText={m.Update_profile()}>
	<Field {form} name="name" options={{ label: 'Username' }} />

	<div class="space-y-2">
		<Field {form} name="email" options={{ type: 'email' }} />

		<CheckboxField {form} name="emailVisibility">
			<span>Show email to other users</span>
		</CheckboxField>
	</div>

	<FileField {form} name="avatar" />
</Form>
