import type { CollectionFieldOptions } from '@/collections-management/collectionField.svelte';
import type { FieldComponentProp } from './fieldComponent';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import type {
	CollectionRecords,
	CollectionRelatedCollections as Related
} from '@/pocketbase/types';
import type { ExpandProp } from '../types';

//

export type FieldsOptions<C extends CollectionName, R = CollectionRecords[C]> = {
	labels: { [K in keyof R]?: string };
	descriptions: { [K in keyof R]?: string };
	placeholders: { [K in keyof R]?: string };
	order: Array<keyof R>;
	exclude: Array<keyof R>;
	hide: { [K in keyof R]?: R[K] };
	defaults: { [K in keyof R]?: R[K] };
	relations: {
		[K in keyof Related[C]]?: BaseCollectionFieldOptions<Related[C][K] & CollectionName>;
	};
	components: { [K in keyof R]?: FieldComponentProp };
};

//

type BaseCollectionFieldOptions<C extends CollectionName> = CollectionFieldOptions<
	C,
	ExpandProp<C>
>;
