import { Option as O, pipe, Record as R, Array as A, Effect, Tuple } from 'effect';
import { Schema as S } from '@effect/schema';
import {
	FieldType as FT,
	type CollectionConfig,
	type FieldConfig
} from '@/pocketbase/schema/types';
import DbConfig from '../export-pb-schema/pb-schema.generated.json'; // TODO - Pass from config
import type { SchemaFilter, FieldSchemaFiltersConfig } from './types';
import { isArrayField } from '@/pocketbase/schema/utils';
import { fieldTypeToSchemaConfig, arrayFieldSchemaFiltersConfig } from './config';

// -- Converters

export function convertDbConfigToSchemas() {
	return pipe(
		DbConfig as CollectionConfig[],
		A.map((collectionConfig) => convertFieldConfigsToObjectSchema(collectionConfig.schema)),
		Effect.all
	);
}

export function convertFieldConfigsToObjectSchema(fieldsConfig: FieldConfig[]) {
	return pipe(
		fieldsConfig,
		A.map((fieldConfig) =>
			pipe(
				convertFieldConfigToSchema(fieldConfig),
				// Create entries to store in record
				Effect.map((schema) => Tuple.make(fieldConfig.name, schema))
			)
		),
		Effect.all,
		Effect.map(R.fromEntries),
		Effect.map(S.Struct)
	);
}

export function convertFieldConfigToSchema(fieldConfig: FieldConfig) {
	return pipe(
		// -- base schema
		getBaseSchema(fieldConfig),
		// -- base filters
		(schema) =>
			pipe(getBaseSchemaFilters(fieldConfig), (filters) => applyFiltersToSchema(schema, filters)),
		// -- array schema
		(schema) =>
			Effect.if(isArrayField(fieldConfig), {
				onFalse: () => Effect.succeed(schema),
				onTrue: () =>
					pipe(S.Array(schema), (arraySchema) =>
						pipe(
							getArraySchemaFilters(fieldConfig),
							(arrayFilters) => applyFiltersToSchema(arraySchema, arrayFilters),
							Effect.succeed
						)
					)
			}),
		// -- required
		(schema) => schema
	);
}

// -- Getters

function getBaseSchema(fieldConfig: FieldConfig) {
	return pipe(
		fieldConfig.type as FT,
		(fieldType) => fieldTypeToSchemaConfig[fieldType],
		O.fromNullable,
		O.getOrThrow,
		(fieldSchemaConfig) => fieldSchemaConfig.schema
	);
}

function getBaseSchemaFilters(fieldConfig: FieldConfig) {
	return pipe(
		fieldConfig.type as FT,
		(fieldType) => fieldTypeToSchemaConfig[fieldType],
		O.fromNullable,
		O.getOrThrow,
		(fieldSchemaConfig) => fieldSchemaConfig.filters,
		O.fromNullable,
		O.getOrElse(() => ({}) as FieldSchemaFiltersConfig<S.Schema.Any>),
		(fieldFiltersConfig) =>
			pipe(
				Object.entries(fieldConfig.options),
				A.filter(([optionName]) => optionName in fieldFiltersConfig),
				A.filter(([, optionValue]) => Boolean(optionValue)),
				A.map(([optionName, optionValue]) =>
					pipe(fieldFiltersConfig, R.get(optionName), O.getOrThrow, (filterCreator) =>
						filterCreator(optionValue)
					)
				)
			)
	);
}

function getArraySchemaFilters(fieldConfig: FieldConfig) {
	return pipe(
		Object.entries(fieldConfig.options),
		A.filter(([optionName]) => optionName in arrayFieldSchemaFiltersConfig),
		A.map(([optionName, optionValue]) =>
			pipe(arrayFieldSchemaFiltersConfig, R.get(optionName), O.getOrThrow, (filterCreator) =>
				filterCreator(optionValue)
			)
		)
	);
}

// -- Utils

function applyFiltersToSchema(schema: S.Schema.Any, filters: SchemaFilter<S.Schema.Any>[]) {
	return A.reduce(filters, schema, (schema, filter) => filter(schema));
}
