import { z } from 'zod';

import { fieldConfigToZodTypeMap, type FieldConfigToZodType } from './config';

import type { CollectionName } from '@/pocketbase/collections-models/types';
import { getCollectionModel } from '@/pocketbase/collections-models';
import { isArrayField } from '@/pocketbase/collections-models/utils';

import { pipe } from 'effect';
import type { CollectionFormData } from '@/pocketbase/types';

//

// Note: a bit of a type hack

export function createCollectionZodSchema<C extends CollectionName>(
	collection: C
): CollectionZodSchema<C> {
	const { schema } = getCollectionModel(collection);
	const entries = schema.map((fieldConfig) => {
		const zodTypeConstructor = fieldConfigToZodTypeMap[fieldConfig.type] as FieldConfigToZodType;
		const zodType = pipe(
			zodTypeConstructor(fieldConfig),
			(zodType) => {
				if (isArrayField(fieldConfig)) return z.array(zodType);
				else return zodType;
			},
			(zodType) => {
				if (fieldConfig.required) {
					if (zodType instanceof z.ZodArray) return zodType.nonempty();
					else return zodType;
				} else {
					// Extra check for url: https://github.com/colinhacks/zod/discussions/1254
					if (fieldConfig.type == 'url') return zodType.or(z.literal('')).nullish();
					else return zodType.nullish();
				}
			}
		);
		return [fieldConfig.name, zodType];
	});
	const rawObject = Object.fromEntries(entries);
	return z.object(rawObject) as CollectionZodSchema<C>;
}

const s = createCollectionZodSchema('z_test_collection');

// eslint-disable-next-line
const y = s.parse({});

type CollectionZodSchema<C extends keyof CollectionFormData> = z.ZodObject<{
	[K in keyof CollectionFormData[C]]-?: TypeToZodOptionalType<CollectionFormData[C][K]>;
}>;

type TypeToZodOptionalType<T> =
	T extends NonNullable<T> ? TypetoZodType<T> : z.ZodOptional<TypetoZodType<T>>;

type TypetoZodType<T> = T extends File
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
						: T extends unknown
							? unknown extends T // ChatGPT: How to match exactly unknown
								? z.ZodUnknown
								: never
							: never;
