import { Schema as S } from '@effect/schema';
import { FieldType as FT } from '@/pocketbase/schema/types';
import { UrlSchema } from '@/utils/schema';

// Base

const FieldIdToSchema = {
	[FT.TEXT]: S.String,
	[FT.NUMBER]: S.Number,
	[FT.EDITOR]: S.String,
	[FT.BOOL]: S.Boolean,
	[FT.FILE]: S.String,
	[FT.SELECT]: S.String,
	[FT.RELATION]: S.String,
	[FT.JSON]: S.Record(S.String, S.Unknown),
	[FT.URL]: UrlSchema
} as const;

type FieldIdToSchema = typeof FieldIdToSchema;
type FieldId = keyof FieldIdToSchema;
type FieldSchema<F extends FieldId> = FieldIdToSchema[F];
type FieldType<F extends FieldId> = FieldSchema<F>['Type'];

//

type FilterCreator<A> = <T>(
	value: T,
	annotations?: S.Annotations.Filter<A>
) => <I, R>(self: S.Schema<A, I, R>) => S.filter<S.Schema<A, I, R>>;

type FieldIdToFilters = {
	[key in FieldId]: Record<string, FilterCreator<FieldType<key>>>;
};

const FieldIdToFilters: Partial<FieldIdToFilters> = {
	text: {
		min: (value, annotations) => S.minLength(S.validateSync(S.Number)(value), annotations),
		max: (value, annotations) => S.maxLength(S.validateSync(S.Number)(value), annotations),
		pattern: (value, annotations) => {
			const pattern = S.validateSync(S.String)(value);
			const regex = new RegExp(`|${pattern}`); // Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
			return S.pattern(regex, annotations);
		}
	},
	number: {
		min: (value, annotations) => S.greaterThan(S.validateSync(S.Number)(value), annotations)
	}
};

// function textFilters(schema: typeof S.String, options: FieldOptions) {
//     const filters: StringFilter[] = []
//     if (options.min) filters.push(S.minLength(options.min))
//     if (options.max) filters.push(S.maxLength(options.max))
//     return filt
// }

// // Filters

// type FieldFilter<F extends FieldId> = (
// 	value: unknown
// ) => <I, R>(self: S.Schema<FieldType<F>, I, R>) => S.filter<S.Schema<FieldType<F>, I, R>>;

// type A = FieldFilter<"text">

// export const FieldTypeFilters: Partial<FieldIdToFilters> = {
// 	text: ,
// 	editor: {},
// 	bool: {},
// 	select: {},
// 	file: {},
// 	relation: {},
// 	json: {},
// 	url: {}
// };
