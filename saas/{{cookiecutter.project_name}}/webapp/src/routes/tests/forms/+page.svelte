<script lang="ts">
	import { SubmitButton, createForm, Form } from '@/forms';
	import { Field, Control, Label, Description, FieldErrors } from 'formsnap';
	import { z } from 'zod';

	const schema = z.object({
		email: z.string().email(),
		emoji: z.string().emoji()
	});

	const form = createForm({ schema });
	const { form: formData, allErrors } = form;
</script>

<Form {form}>
	<Field {form} name="email">
		<Control let:attrs>
			<Label>Email</Label>
			<input {...attrs} type="email" bind:value={$formData.email} />
		</Control>
		<FieldErrors />
	</Field>

	<Field {form} name="emoji">
		<Control let:attrs>
			<Label>Email</Label>
			<input {...attrs} type="text" bind:value={$formData.emoji} />
		</Control>
		<FieldErrors />
	</Field>

	<SubmitButton>submit</SubmitButton>
</Form>

<pre>{JSON.stringify($allErrors, null, 4)}</pre>

<!-- <script lang="ts">
	import { Form, Input, createForm } from '$lib/forms';
	import Checkbox from '$lib/forms/fields/checkbox.svelte';
	import FieldController from '$lib/forms/fields/fieldController.svelte';
	import FileInput from '$lib/forms/fields/file.svelte';
	import Hidden from '$lib/forms/fields/hidden.svelte';
	import Textarea from '$lib/forms/fields/textarea.svelte';
	import Toggle from '$lib/forms/fields/toggle.svelte';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { z } from 'zod';

	const schema = z.object({
		name: z.string(),
		surname: z.string(),
		check: z.boolean(),
		file: z.any()
	});

	const superform = createForm(schema, ({ form }) => {});

	const { form } = superform;
</script>

<Form {superform}>
	<Input
		{superform}
		field="name"
		options={{
			placeholder: 'mimmo',
			id: 'kk',
			'aria-label': 'Mike'
		}}
	/>

	<FieldController {superform} field="name" let:constraints let:value let:updateValue>
		<input
			type="text"
			{value}
			{...constraints}
			on:input={(e) => updateValue(e.currentTarget.value)}
		/>
	</FieldController>

	<Hidden {superform} field="name" />

	<Checkbox {superform} field="check" />
	<Toggle
		{superform}
		field="check"
		options={{
			label: 'maio'
		}}
	/>

	<Textarea {superform} field="name" />

	<FileInput {superform} field="file" />
</Form>

<pre>{JSON.stringify($form)}</pre> -->
