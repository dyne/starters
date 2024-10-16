import { z } from 'zod';

import { fieldConfigToZodTypeMap, type FieldConfigToZodType } from './config';

import type { CollectionFormData } from '@/pocketbase/types/collectionFormData';
import { getCollectionModel } from '@/pocketbase/collections-models';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import { isArrayField } from '@/pocketbase/collections-models/utils';

import { pipe } from 'effect';
// import type { Simplify } from 'type-fest';
import type { If } from '@/utils/types';

// Runtime conversion

export function createCollectionZodSchema<C extends CollectionName>(
	collection: C
): CollectionZodSchema<C> {
	const { schema: pocketbaseFieldsSchema } = getCollectionModel(collection);
	const entries = pocketbaseFieldsSchema.map((fieldConfig) => {
		const zodTypeConstructor = fieldConfigToZodTypeMap[fieldConfig.type] as FieldConfigToZodType;
		const zodType = pipe(
			zodTypeConstructor(fieldConfig),

			// Array type handling
			(zodType) => {
				if (isArrayField(fieldConfig)) {
					const { minSelect, maxSelect } = z
						.object({
							minSelect: z.number().optional(),
							maxSelect: z.number().optional()
						})
						.parse(fieldConfig.options);

					let s = z.array(zodType);
					if (minSelect) s = s.min(minSelect as number);
					if (maxSelect) s = s.max(maxSelect as number);
					return s;
				} else {
					return zodType;
				}
			},

			// Optional type handling
			(zodType) => {
				if (fieldConfig.required) {
					if (zodType instanceof z.ZodArray) return zodType.nonempty();
					else return zodType;
				} else {
					// Extra check for url: https://github.com/colinhacks/zod/discussions/1254
					if (fieldConfig.type == 'url') return zodType.or(z.literal('')).optional();
					else return zodType.optional();
				}
			}
		);

		return [fieldConfig.name, zodType];
	});

	const rawObject = Object.fromEntries(entries);
	return z.object(rawObject) as CollectionZodSchema<C>;
}

// Type conversion

type CollectionZodSchema<C extends CollectionName> = z.ZodObject<CollectionZodRawShape<C>>;

type CollectionZodRawShape<C extends CollectionName, Data = CollectionFormData<C>> = {
	[K in keyof Data]-?: If<
		IsPropertyRequired<Data, K>,
		TypetoZodType<Data[K]>,
		z.ZodOptional<TypetoZodType<Data[K]>>
	>;
};

type TypetoZodType<T> =
	IsExactlyUnknown<T> extends true
		? z.ZodUnknown
		: T extends File
			? z.ZodType<File>
			: T extends File[]
				? z.ZodArray<z.ZodType<File>>
				: T extends number
					? z.ZodNumber
					: T extends boolean
						? z.ZodBoolean
						: T extends string
							? z.ZodString
							: T extends string[]
								? z.ZodArray<z.ZodString>
								: never;

type IsExactlyUnknown<T> = [T] extends [unknown] ? ([unknown] extends [T] ? true : false) : false; // Solution provided by ChatGPT
type IsPropertyRequired<T, K extends keyof T> = T extends { [P in K]-?: T[K] } ? true : false;
