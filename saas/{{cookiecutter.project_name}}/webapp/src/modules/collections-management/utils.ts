import { getCollectionModel } from '@/pocketbase/collections-models';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import type { PBResponse } from '$lib/utils/types';
import { String } from 'effect';
import type { CollectionResponses } from '@/pocketbase/types';

//

export function excludeIdsFilter(ids: string[]) {
	return ids.map((id) => `id != '${id}'`).join(' && ');
}

export function searchTextFilter(collection: CollectionName, text: string) {
	return getCollectionFieldNames(collection)
		.map((f) => `${f} ~ "${text}"`)
		.join(' || ');
}

function getCollectionFieldNames(collection: CollectionName): string[] {
	const fieldNames: string[] = getCollectionModel(collection).schema.map((field) => field.name);
	if (collection == 'users') fieldNames.push('email');
	return fieldNames;
}

//

export function mergeFilters(...filters: Array<string | undefined>): string | undefined {
	const validFilters = filters.filter(String.isString).filter(String.isNonEmpty);
	if (validFilters.length == 1) return validFilters[0];
	else if (validFilters.length > 1) return validFilters.map((f) => `(${f})`).join(' && ');
	else return undefined;
}

//

//

export function createRecordLabel<R extends PBResponse>(
	record: R,
	labelFields: string[] = []
): string {
	const fields: string[] = [];

	if (labelFields.length > 0) {
		fields.push(...labelFields);
	} else {
		fields.push(...getCollectionFieldNames(record.collectionName));
	}

	return fields
		.map((f) => record[f])
		.filter((f) => Boolean(f))
		.join(' | ');
}

//

export type RecordPresenter<R> = (record: R) => string;

export function createDefaultRecordPresenter<C extends CollectionName, R = CollectionResponses[C]>(
	collection: C
): RecordPresenter<R> {
	const fields = getCollectionModel(collection)
		.schema.filter((field) => field.type == 'text')
		.map((field) => field.name) as (keyof R)[];

	return (record) => {
		return fields.map((f) => record[f]).join(' - ');
	};
}
