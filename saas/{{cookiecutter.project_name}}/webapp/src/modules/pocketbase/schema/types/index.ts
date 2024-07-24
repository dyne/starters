import type { ValueOf } from '$lib/utils/types';

// Compiled by hand

export const FieldType = {
	TEXT: 'text',
	NUMBER: 'number',
	EDITOR: 'editor',
	BOOL: 'bool',
	FILE: 'file',
	SELECT: 'select',
	RELATION: 'relation',
	JSON: 'json',
	URL: 'url'
} as const;

export type FieldType = ValueOf<typeof FieldType>;

// Generated using json-to-ts

export type CollectionConfig = {
	id: string;
	created: string;
	updated: string;
	name: string;
	type: string;
	system: boolean;
	schema: FieldConfig[];
	indexes: string[];
	listRule?: string;
	viewRule?: string;
	createRule?: string;
	updateRule?: string;
	deleteRule?: string;
	options: CollectionOptions;
};

export type CollectionOptions = {
	allowEmailAuth?: boolean;
	allowOAuth2Auth?: boolean;
	allowUsernameAuth?: boolean;
	exceptEmailDomains?: unknown;
	manageRule?: unknown;
	minPasswordLength?: number;
	onlyEmailDomains?: unknown;
	onlyVerified?: boolean;
	requireEmail?: boolean;
};

export type FieldConfig = {
	system: boolean;
	id: string;
	name: string;
	type: string;
	required: boolean;
	presentable: boolean;
	unique: boolean;
	options: FieldOptions;
};

export type FieldOptions = {
	min?: number;
	max?: number;
	pattern?: string;
	mimeTypes?: (string | string)[];
	thumbs?: unknown[];
	maxSelect?: number;
	maxSize?: number;
	protected?: boolean;
	values?: string[];
	convertUrls?: boolean;
	collectionId?: string;
	cascadeDelete?: boolean;
	minSelect?: number;
	displayFields?: unknown;
	exceptDomains?: string[];
	onlyDomains?: string[];
	noDecimal?: boolean;
};
