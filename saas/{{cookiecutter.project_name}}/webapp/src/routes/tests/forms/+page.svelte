<script lang="ts">
	import SelectInput from '@/components/custom/selectInput.svelte';
	import { createForm, Form } from '@/forms';
	import { Field, SwitchField, FileField, CheckboxField, TextareaField } from '@/forms/fields';
	import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
	import { createDummyFile } from '@/utils/other';
	import SuperDebug from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	const schema = createCollectionZodSchema('z_test_collection');

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async () => {
			await new Promise((res) => setTimeout(() => res('p1'), 2000));
			throw new Error('no wayy');
		},
		initialData: {
			file_field: createDummyFile()
		},
		options: {
			dataType: 'form'
		}
	});

	const { form: formData } = form;
</script>

<Form {form}>
	<SelectInput
		items={[
			{ label: 'ok', value: 'no' },
			{ label: 'ok1', value: 'no1' },
			{ label: 'ok2', value: 'no2' }
		]}
		placeholder="maio"
		multiple
	></SelectInput>

	<Field {form} name="text_field" />
	<Field {form} name="url_field" options={{ type: 'url' }} />
	<Field {form} name="number_field" options={{ type: 'number' }} />
	<FileField {form} name="file_field" />
	<FileField {form} name="file_multi_field" options={{ multiple: true }} />
	<Field {form} name="date_field" options={{ type: 'date' }} />
	<SwitchField {form} name="boolean_field" />
	<CheckboxField {form} name="boolean_field" />
	<TextareaField {form} name="json_field" />

	<SuperDebug data={formData}></SuperDebug>
</Form>
