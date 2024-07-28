import { FieldType as FT } from '@/pocketbase/schema/types';
import { Schema as S } from '@effect/schema';
import { FileSchema, UrlSchema } from '@/utils/schema';
import type { ArrayFieldSchemaFiltersConfig, FieldTypeToSchemaConfig } from './types';

//

export const fieldTypeToSchemaConfig: FieldTypeToSchemaConfig = {
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

export const arrayFieldSchemaFiltersConfig: ArrayFieldSchemaFiltersConfig = {
	maxSelect: (v: unknown) => S.maxItems<unknown>(S.validateSync(S.Number)(v)),
	minSelect: (v: unknown) => S.minItems<unknown>(S.validateSync(S.Number)(v))
};

// TODO - Pass this as effect context
