import { z } from 'zod';

import { fieldConfigToZodTypeMap, type FieldConfigToZodType } from './config';
import type {
	CollectionName,
	CollectionRequest,
	AnyFieldConfig
} from '@/pocketbase/collections-config/types';
// import type {
// 	CollectionSchemaObject,
// 	CollectionConfig,
// 	CollectionName,
// 	FieldType,
// 	CollectionRequest,
// 	AnyFieldConfig
// } from '@/pocketbase/collections-config/types';

// import type { CollectionRecords } from '@/pocketbase/types';
import { getCollectionConfig } from '../collections-config';
import { isArrayField } from '../collections-config/utils';
import { pipe } from 'effect';
// import { Option, pipe, Record, Tuple } from 'effect';

import * as TF from 'type-fest';
// import type { Not, If } from '@/utils/types';

//

export function createCollectionZodSchema<C extends CollectionName>(
	collection: C
): z.ZodType<TF.Simplify<CollectionRequest<C>>> {
	const { schema } = getCollectionConfig(collection);
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
	return z.object(rawObject) as z.ZodType<CollectionRequest<C>>;
}

const s = createCollectionZodSchema('z_test_collection');
const y = s.parse({});

/* Field Config -> Zod Array */

// type CanBeArrayField<F extends AnyFieldConfig> = F['type'] extends 'file' | 'select' | 'relation'
// 	? true
// 	: false;
// type HasMaxSelectOne<F extends AnyFieldConfig> = F['options'] extends { maxSelect: 1 }
// 	? true
// 	: false;
// type IsArrayField<F extends AnyFieldConfig> = TF.And<CanBeArrayField<F>, Not<HasMaxSelectOne<F>>>;

// type FieldConfigToZodTypeMap = typeof fieldConfigToZodTypeMap;
// type FieldSchema<Type extends FieldType> = ReturnType<FieldConfigToZodTypeMap[Type]>;

// // type N = CollectionRecords["z_test_collection"]

// type CollectionFieldConfig<C extends CollectionName> = CollectionConfig<C>['schema'][number];

// export type CollectionZodSchema<C extends CollectionName, Schema = CollectionSchemaObject<C>> = {
// 	[K in keyof Schema]: FieldSchema<Schema[K]['type']>;
// };
// // [K in keyof CollectionRecords[C]]: FieldSchema<Extract<CollectionRecords[C][""], [K]>>;

// type O = CollectionZodSchema<'z_test_collection'>;
// type N = CollectionZodSchema<"z_test_collection">
// type FieldConfigToSchema<C extends AnyFieldConfig> = If<
// 	IsArrayField<C>,
// 	z.ZodArray<FieldSchema<C>>,
// 	FieldSchema<C>
// >;

// type HandleArray<Field extends FieldConfig, Schema extends ZodTypeAny> = If<
// 	CanBeArrayField<Field>,
// 	Schema,
// 	If<HasMaxSelectOne<Field>, Schema, z.ZodArray<Schema>>
// >;

// type TestArrayField = PocketBaseConfig['13']['schema']['8'];
// type ShouldBeTrue = FieldConfigToSchema<TestArrayField>;

// type TestNotArrayField = PocketBaseConfig['13']['schema']['3'];
// type ShouldBeFalse = FieldConfigToSchema<TestNotArrayField>;

// export type CollectionZodSchema<C extends CollectionName> = z.ZodObject<{
// 	// @ts-expect-error - Slight type mismatch on [K]
// 	[K in keyof CollectionType<C>]: FieldConfigToSchema<CollectionFieldByName<C, K>>;
// }>;

// type N = CollectionZodSchema<'z_test_collection'>; // eslint-disable-line @typescript-eslint/no-unused-vars

// let U: N
// U.extend({}).pick({}).omit({})

// class UnhandledFieldTypeError extends Error {}
// // class UnhandlefFieldOptionsError extends Error {}
// class CollectionSchemaNotFoundError extends Error {}

// function validateDomains(
// 	zodString: z.ZodString,
// 	exceptDomains: readonly string[] | undefined,
// 	onlyDomains: readonly string[] | undefined
// ) {
// 	return zodString
// 		.refine((string) => {
// 			if (exceptDomains) return exceptDomains.every((domain) => !string.includes(domain));
// 			else return true;
// 		})
// 		.refine((email) => {
// 			if (onlyDomains) return onlyDomains.some((domain) => email.includes(domain));
// 			else return true;
// 		});
// }

// // const type = fieldschema.type as FieldType;
// // const fieldOptions = fieldschema.options as Record<string, unknown>;

// // let zodSchema: ZodTypeAny = FieldTypeToZod[type];

// // const refiners = FieldTypeRefiners[type];
// // for (const [key, refiner] of Object.entries(refiners)) {
// //     if (fieldOptions[key]) zodSchema = refiner(zodSchema, fieldOptions);
// // }

// // if (!fieldschema.required) {
// //     // Extra check for url: https://github.com/colinhacks/zod/discussions/1254
// //     if (fieldschema.type == FieldType.URL) zodSchema = zodSchema.or(z.literal(''));

// //     zodSchema = zodSchema.nullish();
// // }

// // if (!isArrayField(fieldschema)) return zodSchema;
// // else {
// //     let arraySchema = z.array(zodSchema);
// //     for (const [key, refiner] of Object.entries(arrayRefiners)) {
// //         if (fieldOptions[key]) arraySchema = refiner(arraySchema as ZodArrayAny, fieldOptions);
// //     }
// //     if (fieldschema.required) return arraySchema.nonempty();
// //     else return arraySchema;
// // }
