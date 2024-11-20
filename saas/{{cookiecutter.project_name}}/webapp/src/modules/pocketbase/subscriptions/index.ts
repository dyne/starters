import type { ExpandQueryOption } from '@/pocketbase/query';
import {
	getCollectionModel,
	getCollectionNameFromId,
	type CollectionName
} from '../collections-models';
import { onDestroy } from 'svelte';
import type { MaybePromise } from '@/utils/types';
import type { RecordSubscription } from 'pocketbase';
import { pb } from '@/pocketbase';
import type { CollectionResponses } from '../types';

//

type SubscriptionCallback<C extends CollectionName, R = CollectionResponses[C]> = (
	data: RecordSubscription<R>
) => MaybePromise<void>;

//

export function setupComponentPocketbaseSubscriptions<C extends CollectionName>(init: {
	collection: C;
	callback: () => MaybePromise<void>;
	expandOption?: ExpandQueryOption<C>;
	other?: CollectionName[];
}) {
	const { collection, callback, expandOption = [], other = [] } = init;
	const collections: CollectionName[] = [
		collection,
		...getRelatedCollectionsFromExpandOption(collection, expandOption),
		...other
	];
	for (const c of collections) {
		setupComponentSubscription(c, callback);
	}
}

function setupComponentSubscription<C extends CollectionName>(
	collection: C,
	callback: SubscriptionCallback<C>
) {
	const unsubscribeFunctionPromise = pb.collection(collection).subscribe('*', callback);
	onDestroy(async () => {
		(await unsubscribeFunctionPromise)();
	});
}

function getRelatedCollectionsFromExpandOption<C extends CollectionName>(
	collection: C,
	expand: ExpandQueryOption<C>
): CollectionName[] {
	const INVERSE_RELATION_KEY = '_via_';

	const inverseRelations = expand
		.filter((expandItem) => expandItem.includes(INVERSE_RELATION_KEY))
		.map((expandItem) => expandItem.split(INVERSE_RELATION_KEY)[0] as CollectionName);

	const directRelations = expand
		.filter((expandItem) => !expandItem.includes(INVERSE_RELATION_KEY))
		.map((expandItem) => {
			const relationField = getCollectionModel(collection)
				.schema.filter((field) => field.type == 'relation')
				.find((field) => field.name == expandItem);

			if (!relationField) throw new Error('relation_field_not_found');
			return getCollectionNameFromId(relationField.options.collectionId!);
		});

	return [...inverseRelations, ...directRelations];
}
