import { z } from 'zod';
import type { ZodTypeAny } from 'zod';
import type { CollectionSchema } from './getCollectionSchema';
import { log } from '$lib/utils/devLog';

const typeToZod: Record<string, ZodTypeAny> = {
	text: z.string(),
	number: z.number(),
	boolean: z.boolean(),
	date: z.date()
};

export function createZodFromSchema(schema: CollectionSchema): z.AnyZodObject {
	const zodSchema: Record<string, ZodTypeAny> = {};
	for (const field of schema) {
		try {
			let zodType = typeToZod[field.type];
			if (!field.required) zodType = zodType.optional();
			zodSchema[field.name] = zodType;
		} catch (e) {
			log(field.type);
			log(e);
		}
	}
	return z.object(zodSchema);
}
