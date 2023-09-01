import jsonSchema from './db_schema.json';
import { Collections } from '../types';
import type { CollectionSchema } from './types';

export * from './types';

//

export function getCollectionSchema(
	collection: Collections | string
): CollectionSchema | undefined {
	return jsonSchema.find((e) => e.name === collection || e.id === collection);
}

//

export const schemas = createSchemasRecord();

function createSchemasRecord(): Record<Collections, CollectionSchema> {
	const schemas: Record<string, CollectionSchema> = {};

	for (const collectionName of Object.values(Collections)) {
		const schema = getCollectionSchema(collectionName);
		if (!schema) throw new Error(`Collection schema not found for ${collectionName}`);
		schemas[collectionName] = schema;
	}

	return schemas as Record<Collections, CollectionSchema>;
}
