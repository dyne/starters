import { superValidate } from 'sveltekit-superforms/client';
import { z } from 'zod';

const schema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		passwordConfirm: z.string().min(8),
		acceptTerms: z.boolean()
	})
	.refine((data) => data.password === data.passwordConfirm, 'PASSWORDS_DO_NOT_MATCH');

export const load = async () => {
	const form = await superValidate(schema);
	return { schema, form };
};
