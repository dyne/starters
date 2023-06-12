<script lang="ts">
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import { getCollectionSchema } from './getCollectionSchema';
	import { collectionSchemaToZod } from './collectionSchemaToZod';
	import type { Collections } from '$lib/pocketbase-types';
	import FieldSchemaToInput from './fieldSchemaToInput.svelte';

	export let collection: Collections;
	export let initialData: any = undefined;

	export let fieldsOrder: string[] = [];
	export let hiddenFields: string[] = [];

	const collectionSchema = getCollectionSchema(collection)!;
	const schema = collectionSchemaToZod(collectionSchema);
	const superform = createForm(
		schema,
		async (input) => {
			console.log(input.form);
		},
		initialData
	);
</script>

<Form {superform}>
	{#each collectionSchema.schema as fieldSchema}
		{@const hidden = hiddenFields.includes(fieldSchema.name)}
		<FieldSchemaToInput {fieldSchema} {hidden} />
	{/each}
</Form>
