import pocketbaseConfig from '@/pocketbase/collections-config/export/pb-schema.generated';
import { z } from 'zod';
import type {
	CollectionTypeWithFile,
	CollectionName,
	AnyCollectionFieldConfig,
	CollectionZodSchema
} from './types';
import type { ResolveType } from '@/utils/types';
import { pipe, Tuple } from 'effect';

//

export function createCollectionZodSchema<C extends CollectionName>(
	collection: C
): CollectionZodSchema<C> {
	const entries = pocketbaseConfig
		.find((collectionConfig) => collectionConfig.name == collection)
		?.schema.map((fieldConfig) =>
			Tuple.make(
				fieldConfig.name as keyof CollectionTypeWithFile<C>,
				pipe(
					fieldConfigToSchema(fieldConfig),
					(schema) => {
						if (!fieldConfig.required) {
							// Extra check for url: https://github.com/colinhacks/zod/discussions/1254
							if (fieldConfig.type == 'url') return schema.or(z.literal('')).nullish();
							else return schema.nullish();
						} else return schema;
					},
					(schema) => {
						if (isArrayField(fieldConfig)) {
							const s = z.array(schema);
							if (fieldConfig.required) return s.nonempty();
							return s.nullish();
						} else return schema;
					}
				)
			)
		);
	if (!entries) throw new CollectionSchemaNotFoundError();
	const rawObject = Object.fromEntries(entries);
	return z.object(rawObject) as CollectionZodSchema<C>;
}

function fieldConfigToSchema(config: AnyCollectionFieldConfig): z.ZodTypeAny {
	//
	if (config.type == 'text') {
		const { max, min, pattern } = config.options;
		let s = z.string();
		if (max) s = s.max(max);
		if (min) s = s.min(min);
		if (pattern) s = s.regex(new RegExp(`|${pattern}`)); // Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
		return s;
	}
	//
	else if (config.type == 'bool') {
		return z.boolean();
	}
	//
	else if (config.type == 'email') {
		const { exceptDomains, onlyDomains } = config.options;
		return pipe(z.string().email(), (zodEmail) =>
			validateDomains(zodEmail, exceptDomains, onlyDomains)
		);
	}
	//
	else if (config.type == 'file') {
		const { mimeTypes, maxSize } = config.options;
		let s = z.instanceof(File);
		if (mimeTypes && mimeTypes.length > 0) {
			const mimes = mimeTypes as readonly string[];
			s = s.refine((file) => mimes.includes(file.type), `File type not: ${mimes.join(', ')}`);
		}
		if (maxSize) {
			s.refine((file) => file.size < maxSize, `File size bigger than ${maxSize} bytes`);
		}
		return s;
	}
	//
	else if (config.type == 'date') {
		const s = z.string();
		return s;
	}
	//
	else if (config.type == 'json') {
		const { maxSize } = config.options;
		return z.record(z.unknown());
		// return z.record(z.unknown()).refine((json) => {
		// 	if (maxSize) new Blob([JSON.stringify(json)]).size < maxSize;
		// 	else return true;
		// });
	}
	//
	else if (config.type == 'relation') {
		return z.string();
	}
	//
	else if (config.type == 'number') {
		const { min, max, noDecimal } = config.options;
		let s = z.number();
		if (min) s = s.min(min);
		if (max) s = s.max(max);
		if (noDecimal) s = s.int();
		return s;
	}
	//
	else if (config.type == 'editor') {
		return z.string();
	}
	//
	else if (config.type == 'select') {
		const { values } = config.options;
		return z.enum(values);
	}
	//
	else if (config.type == 'url') {
		const { exceptDomains, onlyDomains } = config.options;
		return pipe(z.string().url(), (zodUrl) => validateDomains(zodUrl, exceptDomains, onlyDomains));
	}
	//
	else {
		throw new UnhandledFieldTypeError();
	}
}

class UnhandledFieldTypeError extends Error {}
// class UnhandlefFieldOptionsError extends Error {}
class CollectionSchemaNotFoundError extends Error {}

function validateDomains(
	zodString: z.ZodString,
	exceptDomains: readonly string[] | undefined,
	onlyDomains: readonly string[] | undefined
) {
	return zodString
		.refine((string) => {
			if (exceptDomains) return exceptDomains.every((domain) => !string.includes(domain));
			else return true;
		})
		.refine((email) => {
			if (onlyDomains) return onlyDomains.some((domain) => email.includes(domain));
			else return true;
		});
}

// const type = fieldschema.type as FieldType;
// const fieldOptions = fieldschema.options as Record<string, unknown>;

// let zodSchema: ZodTypeAny = FieldTypeToZod[type];

// const refiners = FieldTypeRefiners[type];
// for (const [key, refiner] of Object.entries(refiners)) {
//     if (fieldOptions[key]) zodSchema = refiner(zodSchema, fieldOptions);
// }

// if (!fieldschema.required) {
//     // Extra check for url: https://github.com/colinhacks/zod/discussions/1254
//     if (fieldschema.type == FieldType.URL) zodSchema = zodSchema.or(z.literal(''));

//     zodSchema = zodSchema.nullish();
// }

// if (!isArrayField(fieldschema)) return zodSchema;
// else {
//     let arraySchema = z.array(zodSchema);
//     for (const [key, refiner] of Object.entries(arrayRefiners)) {
//         if (fieldOptions[key]) arraySchema = refiner(arraySchema as ZodArrayAny, fieldOptions);
//     }
//     if (fieldschema.required) return arraySchema.nonempty();
//     else return arraySchema;
// }
