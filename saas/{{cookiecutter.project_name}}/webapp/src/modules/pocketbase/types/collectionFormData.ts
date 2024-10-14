import type {
	CollectionModel,
	AnyCollectionModel,
	CollectionName,
	AnyFieldConfig
} from '@/pocketbase/collections-models/types';
import type { CollectionRecords } from './index.generated';

/* Issue:
 *
 * - Pocketbase generated types have type [string] instead of [File] for file fields
 * - This is good when fetching data from Pocketbase, cause files are fetched as URLs
 * - But, when sending data to Pocketbase, we send [File] types, not [string]
 *
 * The custom type below takes Pocketbase types and replace [string] with [File] where needed
 */

export type CollectionFormData<C extends CollectionName, Collection = CollectionRecords[C]> = {
	[K in keyof Collection]: ConvertFileFieldConfig<
		// @ts-expect-error - Slight type mismatch on [K]
		GetFieldConfigByName<CollectionModel<C>, K>,
		Collection[K]
	>;
};

//

type CollectionFieldsConfig<Model extends AnyCollectionModel> = Model['schema'][number];
type CollectionFieldsNames<Model extends AnyCollectionModel> =
	CollectionFieldsConfig<Model>['name'];

type GetFieldConfigByName<
	Model extends AnyCollectionModel,
	F extends CollectionFieldsNames<Model>
> = Extract<CollectionFieldsConfig<Model>, { name: F }>;

//

type ConvertFileFieldConfig<Config extends AnyFieldConfig, Fallback> =
	Config extends FileField<1> ? File : Config extends FileField<number> ? File[] : Fallback;

type FileField<Max extends 1 | number> = { type: 'file'; options: { maxSelect: Max } };
