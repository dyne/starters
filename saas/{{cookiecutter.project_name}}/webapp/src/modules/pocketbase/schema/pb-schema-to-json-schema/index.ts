import { Option as O, pipe, Record as R, Array as A, Effect, Tuple } from 'effect';
import { Schema as S } from '@effect/schema';
import {
	FieldType as FT,
	type CollectionConfig,
	type FieldConfig
} from '@/pocketbase/schema/types';
import { UrlSchema, FileSchema } from '@/utils/schema';
import DbConfig from '../export-pb-schema/pb-schema.generated.json';

// Top level

export function dbConfigToSchemas() {
	return pipe(DbConfig as CollectionConfig[], A.map(collectionConfigToSchema), Effect.all);
}

export function collectionConfigToSchema(collectionConfig: CollectionConfig) {
	return pipe(
		collectionConfig.schema,
		A.map((fieldConfig) =>
			pipe(
				fieldConfigToSchema(fieldConfig),
				Effect.map((schema) => Tuple.make(fieldConfig.name, schema))
			)
		),
		Effect.all,
		Effect.map(R.fromEntries),
		Effect.map(S.Struct)
	);
}

export function fieldConfigToSchema(fieldConfig: FieldConfig) {
	return pipe(
		// -- base schema
		fieldConfigToBaseSchema(fieldConfig),
		// -- base filters
		(schema) =>
			pipe(fieldConfigToBaseSchemaFilters(fieldConfig), (filters) =>
				applyFiltersToSchema(schema, filters)
			),
		// -- array schema
		(schema) =>
			Effect.if(isArrayField(fieldConfig), {
				onFalse: () => Effect.succeed(schema),
				onTrue: () =>
					pipe(S.Array(schema), (arraySchema) =>
						pipe(
							fieldConfigToArraySchemaFilters(fieldConfig),
							(arrayFilters) => applyFiltersToSchema(arraySchema, arrayFilters),
							Effect.succeed
						)
					)
			})
		// -- required
	);
}

// Base types

type SchemaFilter<S extends S.Schema.Any> = (self: S) => S.filter<S>;
type SchemaFilterCreator<S extends S.Schema.Any, V> = (value: V) => (self: S) => S.filter<S>;

type FieldFiltersConfig<S extends S.Schema.Any> = Record<string, SchemaFilterCreator<S, unknown>>;

type FieldSchemaConfig<S extends S.Schema.Any> = {
	schema: S;
	filters?: FieldFiltersConfig<S>;
};

// Field Config -> Base Schema

type FieldTypeToBaseSchemaConfig = Record<FT, FieldSchemaConfig<S.Schema.Any>>;

const fieldTypeToSchemaConfig: FieldTypeToBaseSchemaConfig = {
	[FT.TEXT]: {
		schema: S.String,
		filters: {
			min: (v) => S.minLength(S.validateSync(S.Number)(v)),
			max: (v) => S.maxLength(S.validateSync(S.Number)(v)),
			pattern: (v) => {
				const pattern = S.validateSync(S.String)(v);
				const regex = new RegExp(`|${pattern}`); // Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
				return S.pattern(regex);
			}
		}
	},
	[FT.NUMBER]: {
		schema: S.Number,
		filters: {
			min: (v) => S.greaterThan(S.validateSync(S.Number)(v)),
			max: (v) => S.lessThan(S.validateSync(S.Number)(v))
		}
	},
	[FT.EDITOR]: { schema: S.String },
	[FT.BOOL]: { schema: S.Boolean },
	[FT.FILE]: { schema: FileSchema },
	[FT.SELECT]: { schema: S.String },
	[FT.RELATION]: { schema: S.String },
	[FT.JSON]: { schema: S.Record(S.String, S.Unknown) },
	[FT.URL]: { schema: UrlSchema },
	[FT.EMAIL]: { schema: S.String },
	[FT.DATE]: { schema: S.String }
};

function fieldConfigToBaseSchema(fieldConfig: FieldConfig) {
	return pipe(
		fieldConfig.type as FT,
		(fieldType) => fieldTypeToSchemaConfig[fieldType],
		O.fromNullable,
		O.getOrThrow,
		(fieldSchemaConfig) => fieldSchemaConfig.schema
	);
}

function fieldConfigToBaseSchemaFilters(fieldConfig: FieldConfig) {
	return pipe(
		fieldConfig.type as FT,
		(fieldType) => fieldTypeToSchemaConfig[fieldType],
		(fieldSchemaConfig) => fieldSchemaConfig.filters,
		O.fromNullable,
		O.getOrElse(() => ({}) as FieldFiltersConfig<S.Schema.Any>),
		(fieldFiltersConfig) =>
			pipe(
				Object.entries(fieldConfig.options),
				A.filter(([optionName]) => optionName in fieldFiltersConfig),
				A.filter(([_, optionValue]) => Boolean(optionValue)),
				A.map(([optionName, optionValue]) =>
					pipe(fieldFiltersConfig, R.get(optionName), O.getOrThrow, (filterCreator) =>
						filterCreator(optionValue)
					)
				)
			)
	);
}

// Field Config -> Array Schema

const arrayFiltersConfig: Record<
	string,
	SchemaFilterCreator<S.Schema<ReadonlyArray<unknown>>, unknown>
> = {
	maxSelect: (v: unknown) => S.maxItems<unknown>(S.validateSync(S.Number)(v)),
	minSelect: (v: unknown) => S.minItems<unknown>(S.validateSync(S.Number)(v))
};

function fieldConfigToArraySchemaFilters(fieldConfig: FieldConfig) {
	return pipe(
		Object.entries(fieldConfig.options),
		A.filter(([optionName]) => optionName in arrayFiltersConfig),
		A.map(([optionName, optionValue]) =>
			pipe(arrayFiltersConfig, R.get(optionName), O.getOrThrow, (filterCreator) =>
				filterCreator(optionValue)
			)
		)
	);
}

function applyFiltersToSchema(schema: S.Schema.Any, filters: SchemaFilter<S.Schema.Any>[]) {
	return A.reduce(filters, schema, (schema, filter) => filter(schema));
}

// const ArrayFilters: Record<string, ArrayFilterCreator> = {
// };

// function OptionalFilter<T extends S.Schema.Any>(schema: T): S.optional<T> {
// 	return S.optional(schema);
// }

// // Convert

// function getFieldConfigSchema<T extends FieldId>(fieldConfig: FieldConfig) {
// 	return pipe(
// 		fieldConfig.type as T,
// 		(fieldType) => getFieldSchema(fieldType),
// 		(fieldSchema) => pipe(getFieldFilters(fieldConfig), (filters) => filters[0](fieldSchema))
// 	);
// }

// function getFieldSchema(fieldId: FieldId) {
// 	return pipe(O.fromNullable(FieldIdToSchema[fieldId]), O.getOrThrow);
// }

// function getFieldFilters<F extends FieldId>(fieldConfig: FieldConfig) {
// 	return pipe(
// 		fieldConfig.type as F,
// 		(fieldType) => FieldIdToFilters[fieldType],
// 		O.fromNullable,
// 		O.map((fieldFilters) =>
// 			pipe(
// 				Object.entries(fieldConfig.options),
// 				A.filter(([optionName]) => optionName in fieldFilters),
// 				A.map(([optionName, optionValue]) =>
// 					pipe(
// 						fieldFilters,
// 						R.get(optionName),
// 						O.map((filterCreator) => filterCreator(optionValue)),
// 						O.getOrThrow
// 					)
// 				)
// 			)
// 		),
// 		O.getOrThrow
// 	);
// }

// function getArrayFilters(fieldConfig: FieldConfig) {
// 	return pipe(
// 		Object.entries(fieldConfig.options),
// 		A.filter(([optionName]) => optionName in ArrayFilters),
// 		A.map(([optionName, optionValue]) =>
// 			pipe(
// 				ArrayFilters,
// 				R.get(optionName),
// 				O.map((filterCreator) => filterCreator(optionValue)),
// 				O.getOrThrow
// 			)
// 		)
// 	);
// }

export function isArrayField(fieldConfig: FieldConfig): boolean {
	const type = fieldConfig.type as FT;
	if (type !== FT.SELECT && type !== FT.RELATION && type !== FT.FILE) return false;

	const maxSelect = fieldConfig.options.maxSelect ?? 0;
	if (maxSelect > 1) return true;
	else return false;
}
