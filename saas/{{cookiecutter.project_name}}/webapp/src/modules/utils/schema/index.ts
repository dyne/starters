import { JSONSchema, Schema as S } from '@effect/schema';

export const FileSchema = S.declare((input: unknown): input is File => input instanceof File).pipe(
	S.annotations({
		jsonSchema: JSONSchema.make(
			S.Struct({
				name: S.String,
				lastModified: S.Number,
				size: S.Number,
				type: S.String
			})
		)
	})
);

export const UrlSchema = S.String.pipe(
	S.filter((value) => {
		try {
			new URL(value);
			return true;
		} catch (_) {
			return false;
		}
	}),
	S.pattern(/^(http:\/\/|https:\/\/).+$/, { message: () => 'Must be an HTTP or HTTPS URL' })
);
