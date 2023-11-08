<script lang="ts">
	import { Form, Input } from '$lib/forms';
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

	const superform = superForm(superValidateSync(schema), {
		validators: schema
	});

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
	<Toggle {superform} field="check" />

	<Textarea {superform} field="name" />

	<FileInput {superform} field="file" />
</Form>

<pre>{JSON.stringify($form)}</pre>
