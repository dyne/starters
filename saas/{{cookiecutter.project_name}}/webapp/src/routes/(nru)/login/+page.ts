import { superValidate } from 'sveltekit-superforms/client';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
	password: z.string()
});

export const load = async () => {
	const form = await superValidate(schema);
	return { schema, form };
};
