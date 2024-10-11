import type { CollectionConfig, CollectionName } from './types';
import collectionsConfig from './export/collections-config.generated';
import { Array, Option, pipe } from 'effect';

export function getCollectionConfig<C extends CollectionName>(collection: C): CollectionConfig<C> {
	return pipe(
		collectionsConfig,
		Array.findFirst((collectionConfig) => collectionConfig.name == collection),
		Option.getOrThrowWith(() => new CollectionNotFoundError())
	) as CollectionConfig<C>;
}

class CollectionNotFoundError extends Error {}
