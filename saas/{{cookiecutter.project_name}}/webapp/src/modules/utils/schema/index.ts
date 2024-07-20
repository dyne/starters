import { Schema } from '@effect/schema';

export const FileSchema = Schema.declare((input: unknown): input is File => input instanceof File);

export const UrlSchema = Schema.String.pipe(
	Schema.filter((value) => {
		try {
			new URL(value);
			return true;
		} catch (_) {
			return false;
		}
	}),
	Schema.pattern(/^(http:\/\/|https:\/\/).+$/, { message: () => 'Must be an HTTP or HTTPS URL' })
);
