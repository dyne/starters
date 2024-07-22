import { Option as O, pipe } from 'effect';
import { Schema as S } from '@effect/schema';
import { FieldType as FT } from '@/pocketbase/schema/types';
import { UrlSchema, FileSchema } from '@/utils/schema';

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

const ArrayFilters: Record<string, FilterCreator<readonly unknown[]>> = {
	maxSelect: (v) => S.maxItems(S.validateSync(S.Number)(v)),
	minSelect: (v) => S.minItems(S.validateSync(S.Number)(v))
};

// Convert

function getFieldSchema(fieldId: FieldId) {
	return O.fromNullable(FieldIdToSchema[fieldId]);
}

function getFieldFilters(fieldId: FieldId) {
	return pipe(FieldIdToFilters[fieldId]);
}
