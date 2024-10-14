<script lang="ts">
	import { createForm, Form } from '@/forms';
	import { Input } from '@/forms/inputs';
	import { createCollectionZodSchema } from '@/pocketbase/zod-schema';
	import SuperDebug from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	SuperDebug;
	const schema = createCollectionZodSchema('z_test_collection');

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async () => {
			await new Promise((res) => setTimeout(() => res('p1'), 2000));
			throw new Error('no wayy');
		}
	});

	const { capture, restore } = form;
	export const snapshot = { capture, restore };

	const { form: formData } = form;
</script>

<Form {form}>
	<Input {form} field="text_field" />
	<Input {form} field="url_field" options={{ type: 'url' }} />
	<Input {form} field="number_field" options={{ type: 'number' }} />
	<Input {form} field="file_field" options={{ type: 'file' }} />
	<Input {form} field="date_field" options={{ type: 'date' }} />

	<SuperDebug data={formData}></SuperDebug>
</Form>
