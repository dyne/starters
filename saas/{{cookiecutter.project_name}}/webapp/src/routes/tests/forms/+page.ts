import { getCollectionZodSchema } from '@/pocketbase/schema/pb-schema-to-json-schema/get';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const adapter = zod(getCollectionZodSchema('orgAuthorizations'));
	const form = await superValidate(adapter);
	return { form };
};
