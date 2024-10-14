import { z } from 'zod';

import { fieldConfigToZodTypeMap, type FieldConfigToZodType } from './config';

import type { CollectionName } from '@/pocketbase/collections-models/types';
import { getCollectionModel } from '@/pocketbase/collections-models';
import { isArrayField } from '@/pocketbase/collections-models/utils';

import { pipe } from 'effect';
import * as TF from 'type-fest';
import type { CollectionFormData } from '@/pocketbase/types';

//

type ZodExtend = Record<string, z.ZodTypeAny>;

type InferZodExtend<E extends ZodExtend> = {
	[K in keyof E]: z.infer<E[K]>;
};

export function createCollectionZodSchema<
	C extends CollectionName,
	Exclude extends (keyof CollectionFormData[C])[],
	Extend extends ZodExtend,
	CollectionZodSchema = z.ZodType<
		TF.Simplify<
			TF.OmitIndexSignature<Omit<CollectionFormData[C], Exclude[number]> & InferZodExtend<Extend>>
		>
	>
>(
	collection: C,
	options: {
		exclude?: Exclude;
		extend?: Extend;
	} = {}
): CollectionZodSchema {
	options;
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
	return z.object(rawObject) as CollectionZodSchema;
}

const s = createCollectionZodSchema('z_test_collection', {
	exclude: [
		'text_field',
		'file_multi_field',
		'relation_field',
		'url_field',
		'boolean_field',
		'number_field',
		'select_field',
		'select_multi_field'
	],
	extend: {
		gino: z.string()
	}
});

// eslint-disable-next-line
const y = s.parse({});

// type CollectionZodSchema<C extends keyof CollectionFormData> = z.ZodObject<{
// 	[K in keyof CollectionFormData[C]]: TypetoZodType<CollectionFormData[C][K]>;
// }>;

// type TypetoZodType<T> = T extends File
// 	? z.ZodType<File>
// 	: T extends File[]
// 		? z.ZodArray<z.ZodType<File>>
// 		: T extends number
// 			? z.ZodNumber
// 			: T extends boolean
// 				? z.ZodBoolean
// 				: T extends string
// 					? z.ZodString
// 					: T extends string[]
// 						? z.ZodArray<z.ZodString>
// 						: T extends unknown
// 							? unknown extends T // ChatGPT: How to match exactly unknown
// 								? z.ZodUnknown
// 								: never
// 							: never;

// type U = CollectionFormData['z_test_collection'];
// type N = CollectionZodSchema<'z_test_collection'>;
