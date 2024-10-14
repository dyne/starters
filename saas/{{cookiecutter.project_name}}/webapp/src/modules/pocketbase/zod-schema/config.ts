import { pipe } from 'effect';
import { z } from 'zod';

import type { FieldType, FieldConfig, AnyFieldConfig } from '@/pocketbase/collections-models/types';

/* Field Config -> Zod Type */

export const fieldConfigToZodTypeMap = {
	text: ({ options }) => {
		const { max, min, pattern } = options;
		let s = z.string();
		if (max) s = s.max(max);
		if (min) s = s.min(min);
		if (pattern) s = s.regex(new RegExp(`|${pattern}`)); // Add a "|" pipe to the regex to allow for empty string (Ciscoheat suggestion)
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
		// eslint-disable-next-line
		const { min, max } = options; // TODO - Implement
		const s = z.string();
		return s;
	},

	json: ({ options }) => {
		// eslint-disable-next-line
		const { maxSize } = options; // TODO - Implement
		return z.unknown();
		// return z.record(z.unknown()).refine((json) => {
		// 	if (maxSize) new Blob([JSON.stringify(json)]).size < maxSize;
		// 	else return true;
	},

	relation: ({ options }) => {
		const s = z.string();
		if (options.maxSelect != 1) return z.array(s);
		return s;
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
		const s = z.string().refine((s) => (values as readonly string[]).includes(s));
		if (options.maxSelect != 1) return z.array(s);
		return s;
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
	config: Config
) => z.ZodTypeAny;

//

function validateDomains(
	zodString: z.ZodString,
	exceptDomains: readonly string[] | undefined,
	onlyDomains: readonly string[] | undefined
) {
	return zodString
		.refine((string) => {
			if (exceptDomains) return exceptDomains.every((domain) => !string.includes(domain));
			else return true;
		})
		.refine((email) => {
			if (onlyDomains) return onlyDomains.some((domain) => email.includes(domain));
			else return true;
		});
}
