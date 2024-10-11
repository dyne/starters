import { Array, Effect, pipe, Record } from 'effect';
import GeneratedSchema from './schema.generated';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import prettier from 'prettier';
import fs from 'node:fs';
import { getCurrentWorkingDirectory } from '@/utils/fs';

pipe(
	GeneratedSchema,
	// @ts-expect-error Type mismatch between {required: readonly string[]} and {required: string[] | boolean}
	Record.map((jsonSchema) => jsonSchemaToZod(jsonSchema)),
	Record.toEntries,
	Array.map(([key, schema]) => `${key}: ${schema}`),
	Array.join(',\n\t'),
	(schema) => `import {z} from 'zod'; \n\n export default {${schema}} as const`,
	(schema) => prettier.format(schema, { parser: 'babel-ts' }),
	(res) => Effect.promise(() => res),
	Effect.tap((schemaString) =>
		fs.writeFileSync(getCurrentWorkingDirectory(import.meta.url) + '/ao.generated.ts', schemaString)
	),
	Effect.runPromise
);
