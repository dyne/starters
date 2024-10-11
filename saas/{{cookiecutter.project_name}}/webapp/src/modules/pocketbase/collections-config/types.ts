import collectionsConfig from '@/pocketbase/collections-config/export/collections-config.generated';
import type { CollectionRecords } from '@/pocketbase/types';
import type { If } from '@/utils/types';

import * as TF from 'type-fest';

//

export type CollectionsConfig = typeof collectionsConfig;

export type AnyCollectionConfig = CollectionsConfig[number];
export type CollectionName = AnyCollectionConfig['name'];
export type CollectionConfig<C extends CollectionName> = Extract<AnyCollectionConfig, { name: C }>;

export type AnyFieldConfig = AnyCollectionConfig['schema'][number];
export type FieldType = AnyFieldConfig['type'];
export type FieldConfig<T extends FieldType> = Extract<AnyFieldConfig, { type: T }>;

//

/* Issue
 *
 * In pocketbase, generated types with [pocketbase-typegen] have:
 * - type [string] instead of [File] for file fields
 * - type [unknown] instead of [JSON] for file fields
 *
 * This is good when fetching data *from* Pocketbase, cause files are provided as URLs [string]
 * But, when sending data to Pocketbase, we send [File] types, not [string]
 *
 * The custom type below takes Pocketbase types and replaces the correct types
 */

type CollectionRecord<C extends CollectionName> = CollectionRecords[C];

type CollectionFieldConfig<C extends CollectionName> = CollectionConfig<C>['schema'][number];
type CollectionFieldName<C extends CollectionName> = CollectionFieldConfig<C>['name'];

type HasMaxSelectOne<F extends AnyFieldConfig> = F['options'] extends { maxSelect: 1 }
	? true
	: false;

type FieldIsType<F extends AnyFieldConfig, T extends FieldType> = F['type'] extends T
	? true
	: false;

type ConvertFieldConfigToRequestType<F extends AnyFieldConfig, Fallback = unknown> = If<
	FieldIsType<F, 'file'>,
	If<HasMaxSelectOne<F>, File, File[]>,
	If<FieldIsType<F, 'json'>, TF.JsonValue, Fallback>
>;

type GetCollectionFieldConfigByName<
	C extends CollectionName,
	F extends CollectionFieldName<C>
> = Extract<CollectionFieldConfig<C>, { name: F }>;

export type CollectionRequest<C extends CollectionName> = {
	[K in keyof CollectionRecord<C>]: ConvertFieldConfigToRequestType<
		// @ts-expect-error - Slight type mismatch on [K]
		GetCollectionFieldConfigByName<C, K>,
		CollectionRecord<C>[K]
	>;
};

// type CanBeArrayField<F extends AnyFieldConfig> = F['type'] extends 'file' | 'select' | 'relation'
// 	? true
// 	: false;
// type IsArrayField<F extends AnyFieldConfig> = TF.And<CanBeArrayField<F>, Not<HasMaxSelectOne<F>>>;
