<script lang="ts">
	import { convertDbConfigToSchemas } from '@/pocketbase/schema/pb-schema-to-json-schema';
	import { Effect, Array as A, pipe } from 'effect';
	import { JSONSchema } from '@effect/schema';

	const res = pipe(
		convertDbConfigToSchemas(),
		Effect.map((schemas) => A.map(schemas, JSONSchema.make)),
		Effect.runSync
	);
</script>

{#each res as r}
	<pre>{JSON.stringify(r, null, 2)}</pre>
{/each}
