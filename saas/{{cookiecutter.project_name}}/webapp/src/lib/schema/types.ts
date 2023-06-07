export interface Collection {
	id: string;
	name: string;
	type: string;
	system: boolean;
	schema: FieldSchema[];
	indexes: string[];
	listRule?: string;
	viewRule?: string;
	createRule?: string;
	updateRule?: string;
	deleteRule?: string;
	options: CollectionOptions;
}

export interface FieldSchema {
	id: string;
	name: string;
	type: string;
	system: boolean;
	required: boolean;
	options: SchemaOptions;
}

export interface SchemaOptions {
	min?: any;
	max?: any;
	pattern?: string;
	maxSelect?: number;
	values?: string[];
	maxSize?: number;
	mimeTypes?: string[];
	thumbs?: any;
	protected?: boolean;
}

export interface CollectionOptions {
	allowEmailAuth?: boolean;
	allowOAuth2Auth?: boolean;
	allowUsernameAuth?: boolean;
	exceptEmailDomains: any;
	manageRule: any;
	minPasswordLength?: number;
	onlyEmailDomains: any;
	requireEmail?: boolean;
}
