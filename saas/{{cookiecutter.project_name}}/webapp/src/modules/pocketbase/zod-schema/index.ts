import { z } from 'zod';

import type { fieldConfigToZodTypeMap } from './config';
import type {
	AnyFieldConfig,
	CollectionConfig,
	CollectionName
} from '@/pocketbase/collections-config/types';

import type { CollectionRecords } from '@/pocketbase/types';

// import * as TF from 'type-fest';
// import type { Not, If } from '@/utils/types';

//

/* Field Config -> Zod Array */

// type CanBeArrayField<F extends AnyFieldConfig> = F['type'] extends 'file' | 'select' | 'relation'
// 	? true
// 	: false;
// type HasMaxSelectOne<F extends AnyFieldConfig> = F['options'] extends { maxSelect: 1 }
// 	? true
// 	: false;
// type IsArrayField<F extends AnyFieldConfig> = TF.And<CanBeArrayField<F>, Not<HasMaxSelectOne<F>>>;

// type FieldConfigToZodTypeMap = typeof fieldConfigToZodTypeMap;

// type N = CollectionRecords["z_test_collection"]

// type FieldSchema<F extends AnyFieldConfig> = ReturnType<FieldConfigToZodTypeMap[F['type']]>;

export type CollectionZodSchema<C extends CollectionName> = {
	[K in keyof CollectionRecords[C]]: CollectionConfig<C>;
};
// [K in keyof CollectionRecords[C]]: FieldSchema<Extract<CollectionRecords[C][""], [K]>>;

type O = CollectionConfig<'z_test_collection'>;
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

// export function createCollectionZodSchema<C extends CollectionName>(
// 	collection: C
// ): CollectionZodSchema<C> {
// 	const entries = pocketbaseConfig
// 		.find((collectionConfig) => collectionConfig.name == collection)
// 		?.schema.map((fieldConfig) =>
// 			Tuple.make(
// 				fieldConfig.name as keyof CollectionTypeWithFile<C>,
// 				pipe(
// 					fieldConfigToSchema(fieldConfig),
// 					(schema) => {
// 						if (!fieldConfig.required) {
// 							// Extra check for url: https://github.com/colinhacks/zod/discussions/1254
// 							if (fieldConfig.type == 'url') return schema.or(z.literal('')).nullish();
// 							else return schema.nullish();
// 						} else return schema;
// 					},
// 					(schema) => {
// 						if (isArrayField(fieldConfig)) {
// 							const s = z.array(schema);
// 							if (fieldConfig.required) return s.nonempty();
// 							return s.nullish();
// 						} else return schema;
// 					}
// 				)
// 			)
// 		);
// 	if (!entries) throw new CollectionSchemaNotFoundError();
// 	const rawObject = Object.fromEntries(entries);
// 	return z.object(rawObject) as CollectionZodSchema<C>;
// }

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
