import { getCollectionSchema } from '$lib/schema/getCollectionSchema';
import { createZodFromSchema } from '$lib/schema/createZodSchema';
import type { Collections } from '$lib/pocketbase-types.js';

export const load = async ({ params }) => {
	const collectionName = params.collection as Collections;

	const collectionSchema = getCollectionSchema(collectionName);
	if (!collectionSchema) throw new Error(`Collection ${params.collection} not found`);

	return { collectionSchema, collectionName };
};
