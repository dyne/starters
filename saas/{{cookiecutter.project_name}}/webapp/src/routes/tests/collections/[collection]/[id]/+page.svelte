<script lang="ts">
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import Input from '$lib/components/forms/input.svelte';
	import { pb } from '$lib/pocketbase';
	import { Label } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	//

	export let data;

	const superform = createForm(data.form, data.collectionZodSchema, async (input) => {
		const formData = input.form.data;
		if (data.record) {
			await pb.collection(data.collectionName).update($page.params.id, formData);
		} else {
			await pb.collection(data.collectionName).create(formData);
		}
		await goto(`/tests/collections/${data.collectionName}`);
	});
	const { restore, capture } = superform;
	export const snapshot = { restore, capture };

	const defaultSubmitButtonText = Boolean(data.record) ? 'Update' : 'Create';
</script>

<div class="p-8">
	<Form {superform} {defaultSubmitButtonText}>
		{#each data.collectionSchema as field (field.name)}
			<Label class="space-y-2">
				<span>{field.name}</span>
				<Input field={field.name} />
			</Label>
		{/each}
	</Form>
</div>
