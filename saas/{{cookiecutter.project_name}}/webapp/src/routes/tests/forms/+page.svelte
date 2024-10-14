<script lang="ts">
	import { createForm, Form } from '@/forms';
	import { Input } from '@/forms/inputs';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const schema = z.object({
		email: z.string().email().optional(),
		emoji: z.string().emoji().optional()
	});

	const form = createForm({
		adapter: zod(schema),
		onSubmit: async () => {
			await new Promise((res) => setTimeout(() => res('p1'), 2000));
			throw new Error('no wayy');
		}
	});
</script>

<Form {form}>
	<Input {form} field="email" />
	<Input {form} field="emoji" />
</Form>
