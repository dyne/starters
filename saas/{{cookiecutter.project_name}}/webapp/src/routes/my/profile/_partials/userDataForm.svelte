<script lang="ts">
	import Checkbox from '$lib/components/forms/checkbox.svelte';
	import FileInput from '$lib/components/forms/file.svelte';
	import Form, { createForm, createFormData } from '$lib/components/forms/form.svelte';
	import FormError from '$lib/components/forms/formError.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import SubmitButton from '$lib/components/forms/submitButton.svelte';
	import { features, featuresNames,  isFeatureActive } from '$lib/features';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Alert } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
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

	const superform = createForm(
		schema,
		async ({ form }) => {
			const formData = createFormData(form.data);
			let email = formData.get('email') as string;
			$currentUser = await pb.collection('users').update($currentUser!.id, {
				name: formData.get('name'),
				emailVisibility: formData.get('emailVisibility')
			});
			if (isEmailChanged) {
				email = formData.get('email') as string;
				await pb.collection('users').requestEmailChange(email);
				alert(
					'Email change request sent. Please check your email and click on the link to confirm the change.'
				);
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
		<Input field="email" disabled={keypairoomActive}/>
		<Checkbox field="emailVisibility">
			<span>Show email to other users</span>
		</Checkbox>
	</div>

	<FileInput field="avatar" />

	<FormError />

	<div>
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
