<script lang="ts">
	import FileManager from '@/components/custom/fileManager.svelte';
	import { createForm, Form } from '@/forms';
	import { Field } from '@/forms/fields';
	import FileField from '@/forms/fields/fileField.svelte';
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
	<Field {form} name="text_field" />
	<Field {form} name="url_field" options={{ type: 'url' }} />
	<Field {form} name="number_field" options={{ type: 'number' }} />
	<FileField {form} name="file_field" />
	<FileField {form} name="file_multi_field" options={{ multiple: true }} />
	<!-- <FilesInput {form} field="file_multi_field" options={{ type: 'file', multiple: true }} /> -->
	<Field {form} name="date_field" options={{ type: 'date' }} />

	<SuperDebug data={formData}></SuperDebug>
</Form>
