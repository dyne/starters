<script lang="ts">
	import FieldSchemaToInput from '$lib/schema/fieldSchemaToInput.svelte';
	import type { Collections } from '$lib/pocketbase-types';
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import { getCollectionSchema } from '$lib/schema/getCollectionSchema';
	import { collectionSchemaToZod } from '$lib/schema/collectionSchemaToZod';

	export let data;

	const collectionSchema = getCollectionSchema(data.item.collectionName as Collections)!;
	const schema = collectionSchemaToZod(collectionSchema);
	const superform = createForm(schema, async (input) => {
		console.log(input.form);
	});
</script>

<Form {superform}>
	{#each collectionSchema.schema as fieldSchema}
		<FieldSchemaToInput {fieldSchema} />
	{/each}
</Form>
