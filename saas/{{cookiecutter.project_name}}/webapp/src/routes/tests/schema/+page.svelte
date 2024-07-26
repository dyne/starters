<script lang="ts">
	import { dbConfigToSchemas } from '@/pocketbase/schema/pb-schema-to-json-schema';
	import { Effect, Array as A, pipe } from 'effect';
	import { JSONSchema } from '@effect/schema';

	const res = pipe(
		dbConfigToSchemas(),
		Effect.map((schemas) =>
			pipe(
				schemas,
				A.map((schema) => pipe(schema, JSONSchema.make))
			)
		),
		Effect.runSync
	);
</script>

{#each res as r}
	<pre>{JSON.stringify(r, null, 2)}</pre>
{/each}
