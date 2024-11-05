<script lang="ts">
	// 1. Import the `Form` component and the `createForm` util
	import { createForm, Form } from '@/forms';
	// 2. Import sample form field
	import { Field } from '@/forms/fields';
	// 3. Import zod to build the schema
	import z from 'zod';
	// 4. Import the zod adapter from `sveltekit-superforms`
	import { zod } from 'sveltekit-superforms/adapters';

	// 5. Build the schema
	const schema = z.object({
		email: z.string().email(),
		password: z.string()
	});

	// 6. Initialize the form
	const form = createForm({
		// 6.1. Pass the schema
		adapter: zod(schema),
		// 6.2. Handle submission
		onSubmit: async ({ form }) => {
			console.log(form.data);
		}
	});
</script>

<!-- 7. Initialize the form by passing the `form` object  -->
<Form {form}>
	<!-- 8. Initialize the field component and enjoy type safety!  -->
	<Field {form} name="email" options={{ type: 'email' }} />
	<Field {form} name="password" options={{ type: 'password' }} />
</Form>
