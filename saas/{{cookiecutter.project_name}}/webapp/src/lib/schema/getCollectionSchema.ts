import type { Collections } from '$lib/pocketbase-types';
import pb_schema from './pb_schema.json';
import type { FieldSchema } from './types';

export type CollectionSchema = FieldSchema[];

export function getCollectionSchema(collection: Collections): CollectionSchema | undefined {
	return pb_schema.find((e) => e.name === collection)?.schema;
}
