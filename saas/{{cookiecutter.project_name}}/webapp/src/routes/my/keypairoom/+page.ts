import { z } from 'zod';
import type { UserAnswers } from '$lib/auth/userQuestions';
import { superValidate } from 'sveltekit-superforms/client';

const schema = (
	z.object({
		question1: z.string(),
		question2: z.string(),
		question3: z.string(),
		question4: z.string(),
		question5: z.string()
	}) satisfies z.ZodType<UserAnswers>
)
	.partial()
	.refine((v) => {
		return Object.values(v).filter((v) => Boolean(v)).length >= 3;
	}, 'AT_LEAST_THREE_QUESTIONS');

export const load = async () => {
	const form = await superValidate(schema);
	return { schema, form };
};
