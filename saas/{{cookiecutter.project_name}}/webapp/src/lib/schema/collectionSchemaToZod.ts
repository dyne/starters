import { z } from 'zod';
import type { ZodEffects, ZodTypeAny } from 'zod';
import { log } from '$lib/utils/devLog';
import type { ValueOf } from '$lib/utils/types';
import { type FieldSchema, FieldType } from './types';

//

const FieldTypeToZod = {
	[FieldType.TEXT]: z.string(),
	[FieldType.EDITOR]: z.string(),
	[FieldType.BOOL]: z.boolean(),
	[FieldType.FILE]: z.array(z.custom<File>((f) => f instanceof File)),
	[FieldType.SELECT]: z.string()
};

type FieldTypeRefiner<T extends ValueOf<typeof FieldTypeToZod>> = (
	schema: T,
	options: Record<string, unknown>
) => ZodEffects<T> | T;

type FieldTypeRefiners = {
	[key in keyof typeof FieldTypeToZod]: Record<
		string,
		FieldTypeRefiner<(typeof FieldTypeToZod)[key]>
	>;
};

const FieldTypeRefiners: FieldTypeRefiners = {
	[FieldType.TEXT]: {
		min: (s, o) => s.min(o.min as number),
		max: (s, o) => s.max(o.max as number),
		// Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
		pattern: (s, o) => s.regex(new RegExp(`|${o.pattern}` as string))
	},
	[FieldType.FILE]: {
		maxSize: (s, o) =>
			s.refine((files) => files.every((file) => file.size < (o.maxSize as number))),
		mimeTypes: (s, o) =>
			s.refine((files) => files.every((file) => (o.mimeTypes as string[]).includes(file.type))),
		maxSelect: (s, o) => s.refine((files) => files.length <= (o.maxSelect as number))
	},
	[FieldType.BOOL]: {},
	[FieldType.EDITOR]: {},
	[FieldType.SELECT]: {
		values: (s, o) => s.refine((value) => (o.values as string[]).includes(value)),
		maxSelect: (s, o) => {
			// s.refine((values) => values.length <= (o.maxSelect as number))
			if ((o.maxSelect as number) > 1) log('multiple select not supported yet');
			return s;
		}
	}
};

//

function fieldSchemaToZod(fieldschema: FieldSchema) {
	const type = fieldschema.type as FieldType;
	let zodSchema: ZodTypeAny = FieldTypeToZod[type];
	//
	const refiners = FieldTypeRefiners[type];
	for (const [key, refiner] of Object.entries(refiners)) {
		if (fieldschema.options[key]) zodSchema = refiner(zodSchema, fieldschema.options);
	}
	//
	if (!fieldschema.required) zodSchema = zodSchema.optional().nullable().nullish();
	//
	return zodSchema;
}

export function fieldsSchemaToZod(fields: FieldSchema[]): z.AnyZodObject {
	const zodSchema: Record<string, ZodTypeAny> = {};
	for (const field of fields) {
		try {
			zodSchema[field.name] = fieldSchemaToZod(field);
		} catch (e) {
			log(e);
			log(field);
		}
	}
	return z.object(zodSchema);
}
