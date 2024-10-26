import { pipe } from 'effect';
import { z } from 'zod';

import type { FieldType, FieldConfig, AnyFieldConfig } from '@/pocketbase/collections-models/types';
import { getJsonDataSize } from '@/utils/other';

import { isBefore, isAfter, isValid, parseISO } from 'date-fns';
import type { SetFieldType } from 'type-fest';
import { m } from '@/i18n';

/* Field Config -> Zod Type */

export const fieldConfigToZodTypeMap = {
	text: (config) => {
		const { max, min, pattern } = config.options;
		let s = z.string();
		if (max) s = s.max(max);
		if (min) s = s.min(min);
		if (pattern) {
			// Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
			const maybeOptionalPattern = config.required ? pattern : `|${pattern}`;
			s = s.regex(new RegExp(maybeOptionalPattern));
		}
		return s;
	},

	bool: () => {
		return z.boolean();
	},

	email: ({ options }) => {
		const { exceptDomains, onlyDomains } = options;
		return pipe(z.string().email(), (zodEmail) =>
			validateDomains(zodEmail, exceptDomains, onlyDomains)
		);
	},

	file: ({ options }) => {
		const { mimeTypes, maxSize } = options;
		let s = z.instanceof(File);
		if (mimeTypes && mimeTypes.length > 0) {
			const mimes = mimeTypes as readonly string[];
			s = s.refine((file) => mimes.includes(file.type), `File type not: ${mimes.join(', ')}`);
		}
		if (maxSize) {
			s.refine((file) => file.size < maxSize, `File size bigger than ${maxSize} bytes`);
		}
		return s;
	},

	date: ({ options }) => {
		const { min, max } = options;
		return z
			.string()
			.refine(
				(string) => isValid(parseISO(string)),
				(value) => ({ message: `${value} is not a ISO date string` })
			)
			.refine(
				(date) => (min ? isAfter(date, min) : true),
				(value) => ({ message: `${value} is before ${min}` })
			)
			.refine(
				(date) => (max ? isBefore(date, max) : true),
				(value) => ({ message: `${value} is after ${max}` })
			);
	},

	json: ({ options }) => {
		const { maxSize } = options;
		return z.unknown().refine((json) => {
			if (maxSize) return getJsonDataSize(json) < maxSize;
			else return true;
		}, `Json size is bigger than ${maxSize} bytes`);
	},

	relation: () => {
		return z.string();
	},

	number: ({ options }) => {
		const { min, max, noDecimal } = options;
		let s = z.number();
		if (min) s = s.min(min);
		if (max) s = s.max(max);
		if (noDecimal) s = s.int();
		return s;
	},

	select: ({ options }) => {
		const { values } = options;
		return z.string().refine((s) => (values as readonly string[]).includes(s));
	},

	editor: () => {
		return z.string();
	},

	url: ({ options }) => {
		const { exceptDomains, onlyDomains } = options;
		return pipe(z.string().url(), (zodUrl) => validateDomains(zodUrl, exceptDomains, onlyDomains));
	}
} as const satisfies FieldConfigToZodTypeMapRequirement;

type FieldConfigToZodTypeMapRequirement = {
	[Type in FieldType]: FieldConfigToZodType<FieldConfig<Type>>;
};

export type FieldConfigToZodType<Config extends AnyFieldConfig = AnyFieldConfig> = (
	config: SetFieldType<Config, 'options', Partial<Config['options']>> // We are not sure that those options exist
) => z.ZodTypeAny;

//

function validateDomains(
	zodString: z.ZodString,
	exceptDomains: readonly string[] | undefined = undefined,
	onlyDomains: readonly string[] | undefined = undefined
) {
	let s: z.ZodString | z.ZodEffects<z.ZodString> | z.ZodEffects<z.ZodEffects<z.ZodString>> =
		zodString;

	if (onlyDomains?.length) {
		s = s.refine(
			(string) => onlyDomains.some((domain) => string.includes(domain)),
			m.URL_is_not_in_allowed_domains_list() + ': ' + (onlyDomains ?? []).join(', ')
		);
	}

	if (exceptDomains?.length) {
		s = s.refine(
			(string) => exceptDomains.every((domain) => !string.includes(domain)),
			m.URL_is_in_forbidden_domains_list() + ': ' + (exceptDomains ?? []).join(', ')
		);
	}

	return s;
}
