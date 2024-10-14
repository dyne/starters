import type { CollectionModel, CollectionName } from './types';
import collectionsModels from './export/collections-models.generated';
import { Array, Option, pipe } from 'effect';
import type { WritableDeep, SimplifyDeep } from 'type-fest';

export function getCollectionModel<C extends CollectionName>(collection: C) {
	return pipe(
		collectionsModels,
		Array.findFirst((collectionConfig) => collectionConfig.name == collection),
		Option.getOrThrowWith(() => new CollectionNotFoundError())
	) as SimplifyDeep<WritableDeep<CollectionModel<C>>>;
}

class CollectionNotFoundError extends Error {}
