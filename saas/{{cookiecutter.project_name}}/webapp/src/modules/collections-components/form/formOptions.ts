import type { CollectionFieldOptions } from '@/collections-components/collectionField.svelte';
import type { FieldComponentProp } from './fieldComponent';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import type {
	CollectionRecords,
	CollectionResponses,
	CollectionRelatedCollections as Related
} from '@/pocketbase/types';
import type { ExpandProp } from '../types';
import type { FormOptions as SuperformOptions } from '@/forms';
import type { KeyOf, MaybePromise } from '@/utils/types';
import { merge } from 'lodash';

/* Fields */

export type FieldsOptions<C extends CollectionName, R = CollectionRecords[C]> = {
	labels: { [K in keyof R]?: string };
	descriptions: { [K in keyof R]?: string };
	placeholders: { [K in keyof R]?: string };
	order: Array<KeyOf<R>>;
	exclude: Array<KeyOf<R>>;
	hide: { [K in keyof R]?: R[K] };
	defaults: { [K in keyof R]?: R[K] };
	relations: {
		[K in keyof Related[C]]?: BaseCollectionFieldOptions<Related[C][K] & CollectionName>;
	};
	components: { [K in keyof R]?: FieldComponentProp };
};

type BaseCollectionFieldOptions<C extends CollectionName> = CollectionFieldOptions<
	C,
	ExpandProp<C>
>;

function defaultFieldsOptions<C extends CollectionName>(): FieldsOptions<C> {
	return {
		order: [],
		exclude: [],
		defaults: {},
		labels: {},
		placeholders: {},
		descriptions: {},
		hide: {},
		relations: {},
		components: {}
	};
}

/* UI */

type UIOptions = {
	submitButtonText?: string | undefined;
	showCancelButton?: boolean;
	hideRequiredIndicator?: boolean;
};

function defaultUIOptions(): UIOptions {
	return {
		submitButtonText: undefined,
		showCancelButton: false,
		hideRequiredIndicator: false
	};
}

/* Wrapper type */

export type CollectionFormOptions<C extends CollectionName> = {
	superform?: SuperformOptions;
	fields?: FieldsOptions<C>;
	ui?: UIOptions;
};

export function defaultFormOptions<C extends CollectionName>(
	options: CollectionFormOptions<C> = {}
): CollectionFormOptions<C> {
	return merge(
		{
			superform: {},
			fields: defaultFieldsOptions<C>(),
			ui: defaultUIOptions()
		},
		options
	);
}

/*  */

export type CollectionFormMode = 'create' | 'update';

export type OnCollectionFormSuccess<C extends CollectionName> = (
	record: CollectionResponses[C],
	mode: CollectionFormMode
) => MaybePromise<void>;
