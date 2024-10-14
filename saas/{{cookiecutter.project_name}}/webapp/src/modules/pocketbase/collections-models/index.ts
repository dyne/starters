import type { CollectionModel, CollectionName } from './types';
import collectionsModels from './export/collections-models.generated';
import { Array, Option, pipe } from 'effect';

export function getCollectionModel<C extends CollectionName>(collection: C): CollectionModel<C> {
	return pipe(
		collectionsModels,
		Array.findFirst((collectionConfig) => collectionConfig.name == collection),
		Option.getOrThrowWith(() => new CollectionNotFoundError())
	) as CollectionModel<C>;
}

class CollectionNotFoundError extends Error {}
