<script lang="ts">
	import { Form, Hidden, Input, Textarea, createForm, Checkbox, Toggle } from '$lib/forms';
	import SuperDebug from 'sveltekit-superforms';
	// import Checkbox from '$lib/forms/fields/checkbox.svelte';
	// import FieldController from '$lib/forms/fields/fieldController.svelte';
	// import FileInput from '$lib/forms/fields/file.svelte';
	// import Hidden from '$lib/forms/fields/hidden.svelte';
	// import Textarea from '$lib/forms/fields/textarea.svelte';
	// import Toggle from '$lib/forms/fields/toggle.svelte';
	import { z } from 'zod';

	const schema = z.object({
		name: z.string(),
		surname: z.string(),
		check: z.boolean(),
		select: z.string(),
		file: z.any()
	});

	const form = createForm(schema, ({ form }) => {});
	const { form: formData, errors } = form;
</script>

<Form {form}>
	<Input
		{form}
		field="name"
		options={{
			label: 'Your name',
			placeholder: 'mimmo',
			description: 'Your name will be used by other organizations'
		}}
	/>

	<Textarea {form} field="name" options={{ label: 'Your name, but in textarea' }} />
	<Hidden {form} field="name" />

	<Checkbox {form} field="check" options={{ label: 'The check' }} />
	<Toggle {form} field="check" options={{ label: 'The check, switch' }} />

	<!-- 
	<FieldController {superform} field="name" let:constraints let:value let:updateValue>
		<input
			type="text"
			{value}
			{...constraints}
			on:input={(e) => updateValue(e.currentTarget.value)}
		/>
	</FieldController>


	
	<Toggle
		{superform}
		field="check"
		options={{
			label: 'maio'
		}}
	/>

	<Textarea {superform} field="name" />

	<FileInput {superform} field="file" /> -->
	<SuperDebug data={$formData}></SuperDebug>
	<SuperDebug data={$errors}></SuperDebug>
</Form>

<!-- <pre>{JSON.stringify($form)}</pre> -->
