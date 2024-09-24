// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ValueOf } from '$lib/utils/types';

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

// Types generated by parsing ./db_schema.json with https://jvilk.com/MakeTypes/
// Edited by hand to make CollectionSchema['schema'] required,

export type CollectionSchema = {
	id: string;
	created: string;
	updated: string;
	name: string;
	type: string;
	system: boolean;
	schema: FieldSchema[];
	indexes?: (string | null)[] | null;
	listRule?: string | null;
	viewRule?: string | null;
	createRule?: string | null;
	updateRule?: string | null;
	deleteRule?: string | null;
	options: CollectionOptions;
};

export type FieldSchema = {
	id: string;
	name: string;
	type: string;
	system: boolean;
	required: boolean;
	options: FieldOptions;
};

export type FieldOptions = {
	min?: number | null;
	max?: number | null;
	pattern?: string | null;
	maxSelect?: number | null;
	maxSize?: number | null;
	mimeTypes?: string[] | null;
	thumbs?: null[] | null;
	protected?: boolean | null;
	values?: string[] | null;
	collectionId?: string | null;
	cascadeDelete?: boolean | null;
	minSelect?: null;
	displayFields?: null[] | null;
};

export type CollectionOptions = {
	allowEmailAuth?: boolean | null;
	allowOAuth2Auth?: boolean | null;
	allowUsernameAuth?: boolean | null;
	exceptEmailDomains?: null;
	manageRule?: null;
	minPasswordLength?: number | null;
	onlyEmailDomains?: null;
	requireEmail?: boolean | null;
};
