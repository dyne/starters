import { Option as O, pipe, Record as R, Array as A, Record, Tuple as T } from 'effect';
import { Schema as S } from '@effect/schema';
import { FieldType as FT, type FieldConfig } from '@/pocketbase/schema/types';
import { UrlSchema, FileSchema } from '@/utils/schema';
import type { ReadonlyRecord } from 'effect/Record';

// Base

const FieldIdToSchema = {
	[FT.TEXT]: S.String,
	[FT.NUMBER]: S.Number,
	[FT.EDITOR]: S.String,
	[FT.BOOL]: S.Boolean,
	[FT.FILE]: FileSchema,
	[FT.SELECT]: S.String,
	[FT.RELATION]: S.String,
	[FT.JSON]: S.Record(S.String, S.Unknown),
	[FT.URL]: UrlSchema
} as const;

type FieldIdToSchema = typeof FieldIdToSchema;
type FieldId = keyof FieldIdToSchema;
type FieldSchema<F extends FieldId> = FieldIdToSchema[F];
type FieldType<F extends FieldId> = FieldSchema<F>['Type'];

// Filters

type FilterCreator<A> = <T>(
	value: T
) => <I, R>(self: S.Schema<A, I, R>) => S.filter<S.Schema<A, I, R>>;

type FieldFilters<A> = Record<string, FilterCreator<A>>;

type FieldIdToFilters = {
	[key in FieldId]: FieldFilters<FieldType<key>>;
};

// TODO - Add annotations
// TODO - Complete list
const FieldIdToFilters: Partial<FieldIdToFilters> = {
	text: {
		min: (v) => S.minLength(S.validateSync(S.Number)(v)),
		max: (v) => S.maxLength(S.validateSync(S.Number)(v)),
		pattern: (v) => {
			const pattern = S.validateSync(S.String)(v);
			const regex = new RegExp(`|${pattern}`); // Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
			return S.pattern(regex);
		}
	},
	number: {
		min: (v) => S.greaterThan(S.validateSync(S.Number)(v)),
		max: (v) => S.lessThan(S.validateSync(S.Number)(v))
	}
};

type ArrayFilterCreator = FilterCreator<readonly unknown[]>;

const ArrayFilters: Record<string, ArrayFilterCreator> = {
	maxSelect: (v) => S.maxItems(S.validateSync(S.Number)(v)),
	minSelect: (v) => S.minItems(S.validateSync(S.Number)(v))
};

function OptionalFilter<T extends S.Schema.Any>(schema: T): S.optional<T> {
	return S.optional(schema);
}

// Convert

function getFieldConfigSchema<T extends FieldId>(fieldConfig: FieldConfig) {
	return pipe(
		fieldConfig.type as T,
		(fieldType) => getFieldSchema(fieldType),
		(fieldSchema) => pipe(getFieldFilters(fieldConfig), (filters) => filters[0](fieldSchema))
	);
}

function getFieldSchema(fieldId: FieldId) {
	return pipe(O.fromNullable(FieldIdToSchema[fieldId]), O.getOrThrow);
}

function getFieldFilters<F extends FieldId>(fieldConfig: FieldConfig) {
	return pipe(
		fieldConfig.type as F,
		(fieldType) => FieldIdToFilters[fieldType],
		O.fromNullable,
		O.map((fieldFilters) =>
			pipe(
				Object.entries(fieldConfig.options),
				A.filter(([optionName]) => optionName in fieldFilters),
				A.map(([optionName, optionValue]) =>
					pipe(
						fieldFilters,
						R.get(optionName),
						O.map((filterCreator) => filterCreator(optionValue)),
						O.getOrThrow
					)
				)
			)
		),
		O.getOrThrow
	);
}

function getArrayFilters(fieldConfig: FieldConfig) {
	return pipe(
		Object.entries(fieldConfig.options),
		A.filter(([optionName]) => optionName in ArrayFilters),
		A.map(([optionName, optionValue]) =>
			pipe(
				ArrayFilters,
				R.get(optionName),
				O.map((filterCreator) => filterCreator(optionValue)),
				O.getOrThrow
			)
		)
	);
}

export function isArrayField(fieldConfig: FieldConfig): boolean {
	const type = fieldConfig.type as FT;
	if (type !== FT.SELECT && type !== FT.RELATION && type !== FT.FILE) return false;

	const maxSelect = fieldConfig.options.maxSelect ?? 0;
	if (maxSelect > 1) return true;
	else return false;
}
