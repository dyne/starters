import collectionsConfig from '@/pocketbase/collections-config/export/collections-config.generated';

export type CollectionsConfig = typeof collectionsConfig;

export type AnyCollectionConfig = CollectionsConfig[number];
export type CollectionName = AnyCollectionConfig['name'];
export type CollectionConfig<C extends CollectionName> = Extract<AnyCollectionConfig, { name: C }>;

export type AnyFieldConfig = AnyCollectionConfig['schema'][number];
export type FieldType = AnyFieldConfig['type'];
export type FieldConfig<T extends FieldType> = Extract<AnyFieldConfig, { type: T }>;
