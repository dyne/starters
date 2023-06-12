<script lang="ts">
	import Form, { createForm } from '$lib/components/forms/form.svelte';
	import { getCollectionSchema } from './getCollectionSchema';
	import { fieldsSchemaToZod } from './collectionSchemaToZod';
	import type { Collections } from '$lib/pocketbase-types';
	import FieldSchemaToInput from './fieldSchemaToInput.svelte';
	import type { FieldSchema } from './types';
	import { pb } from '$lib/pocketbase';
	import { log } from 'debug';
	import type { AnyZodObject } from 'zod';

	export let collection: Collections;
	export let initialData: any = undefined;

	export let fieldsOrder: string[] = [];
	export let hiddenFields: string[] = [];
	export let excludedFields: string[] = [];

	const collectionSchema = getCollectionSchema(collection)!;
	const fieldsSchema = collectionSchema.schema.sort(sortFieldsSchema).filter(filterFieldsSchema);
	const zodSchema = fieldsSchemaToZod(fieldsSchema);

	const superform = createForm(
		zodSchema,
		async ({ form }) => {
			const formData = createFormData(form.data);
			if (initialData && initialData.id) {
				await pb.collection(collection).update(initialData.id, formData);
			} else {
				await pb.collection(collection).create(formData);
			}
		},
		initialData
	);

	//

	function sortFieldsSchema(a: any, b: any) {
		const aIndex = fieldsOrder.indexOf(a.name);
		const bIndex = fieldsOrder.indexOf(b.name);
		if (aIndex === -1 && bIndex === -1) {
			return 0;
		}
		if (aIndex === -1) {
			return 1;
		}
		if (bIndex === -1) {
			return -1;
		}
		return aIndex - bIndex;
	}

	function filterFieldsSchema(schema: FieldSchema) {
		return !excludedFields.includes(schema.name);
	}

	function createFormData(data: Record<string, unknown>) {
		const formData = new FormData();
		for (const [key, value] of Object.entries(data)) {
			if (value instanceof File) {
				formData.append(key, value);
			} else if (Array.isArray(value)) {
				for (const item of value) {
					formData.append(key, item);
				}
			} else {
				formData.append(key, value as string);
			}
		}
		return formData;
	}
</script>

<Form {superform}>
	{#each fieldsSchema as fieldSchema}
		{@const hidden = hiddenFields.includes(fieldSchema.name)}
		<FieldSchemaToInput {fieldSchema} {hidden} />
	{/each}
</Form>
