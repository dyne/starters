import { getCollectionSchema } from '$lib/schema/getCollectionSchema';
import { createZodFromSchema } from '$lib/schema/createZodSchema';
import type { Collections } from '$lib/pocketbase-types.js';
import { superValidate } from 'sveltekit-superforms/client';
import { pb } from '$lib/pocketbase';
import type { AnyZodObject } from 'zod';
import type { Validation } from 'sveltekit-superforms/index';
import type { Record } from 'pocketbase';
import { log } from '$lib/utils/devLog';

export const load = async ({ params }) => {
	const collectionName = params.collection as Collections;

	const collectionSchema = getCollectionSchema(collectionName);
	if (!collectionSchema) throw new Error(`Collection ${params.collection} not found`);

	const collectionZodSchema = createZodFromSchema(collectionSchema);

	let record: Record | undefined;
	try {
		record = await pb.collection(collectionName).getOne(params.id);
	} catch (e) {
		log(e);
	}

	let form: Validation<AnyZodObject>;
	if (record) {
		form = await superValidate(record, collectionZodSchema);
	} else {
		form = await superValidate(collectionZodSchema);
	}

	return { form, collectionZodSchema, record };
};
