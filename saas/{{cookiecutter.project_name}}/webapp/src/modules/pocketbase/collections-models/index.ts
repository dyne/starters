export * from './collections-models.generated';

//

import {
	CollectionsModels,
	type CollectionName,
	type AnySchemaField,
	type FileSchemaField,
	type RelationSchemaField,
	type SelectSchemaField,
	type AnyCollectionModel
} from './collections-models.generated';
import { Array, Option, pipe } from 'effect';

//

export function getCollectionModel(collection: CollectionName): AnyCollectionModel {
	return pipe(
		CollectionsModels as AnyCollectionModel[],
		Array.findFirst((model) => model.name == collection),
		Option.getOrThrowWith(() => new CollectionNotFoundError())
	);
}

export function getCollectionNameFromId(id: string): CollectionName {
	return pipe(
		CollectionsModels,
		Array.findFirst((model) => model.id == id),
		Option.getOrThrowWith(() => new CollectionNotFoundError()),
		(model) => model.name as CollectionName
	);
}

class CollectionNotFoundError extends Error {}

//

export function isArrayField(
	fieldConfig: AnySchemaField
): fieldConfig is FileSchemaField | SelectSchemaField | RelationSchemaField {
	const type = fieldConfig.type;
	if (type !== 'select' && type !== 'relation' && type !== 'file') return false;
	if (fieldConfig.options.maxSelect === 1) return false;
	else return true;
}

export function getRelationFields<C extends CollectionName>(collection: C): string[] {
	return getCollectionModel(collection)
		.schema.filter((field) => field.type == 'relation')
		.map((field) => field.name);
}
