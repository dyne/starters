/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Authorizations = "authorizations",
	AuthorizationsExamples = "authorizationsExamples",
	CrudExample = "crudExample",
	Features = "features",
	Hooks = "hooks",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthorizationsRecord = {
	owner: RecordIdString
	users: RecordIdString[]
	collection_id: string
	record_id: string
}

export type AuthorizationsExamplesRecord = {
	name: string
	owner?: RecordIdString
}

export enum CrudExampleSelectOptions {
	"opt1" = "opt1",
	"opt2" = "opt2",
	"opt3" = "opt3",
	"opt4" = "opt4",
	"opt5" = "opt5",
}

export enum CrudExampleMultiselectOptions {
	"A" = "A",
	"B" = "B",
	"C" = "C",
	"D" = "D",
}
export type CrudExampleRecord = {
	text: string
	file_only_pdf_json: string[]
	boolean?: boolean
	select: CrudExampleSelectOptions
	textarea?: HTMLString
	text_with_regex?: string
	multiselect?: CrudExampleMultiselectOptions[]
	relation?: RecordIdString[]
	image?: string
	relation_single: RecordIdString
	owner?: RecordIdString
}

export type FeaturesRecord<TenvVariables = unknown> = {
	name: string
	active?: boolean
	envVariables?: null | TenvVariables
}

export enum HooksEventOptions {
	"insert" = "insert",
	"update" = "update",
	"delete" = "delete",
}

export enum HooksActionTypeOptions {
	"command" = "command",
	"post" = "post",
}
export type HooksRecord = {
	collection: string
	event: HooksEventOptions
	action_type: HooksActionTypeOptions
	action: string
	action_params?: string
	expands?: string
	disabled?: boolean
}

export type UsersRecord = {
	name?: string
	avatar?: string
	bitcoin_public_key?: string
	ecdh_public_key?: string
	eddsa_public_key?: string
	ethereum_address?: string
	reflow_public_key?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AuthorizationsResponse<Texpand = unknown> = Required<AuthorizationsRecord> & BaseSystemFields<Texpand>
export type AuthorizationsExamplesResponse<Texpand = unknown> = Required<AuthorizationsExamplesRecord> & BaseSystemFields<Texpand>
export type CrudExampleResponse<Texpand = unknown> = Required<CrudExampleRecord> & BaseSystemFields<Texpand>
export type FeaturesResponse<TenvVariables = unknown> = Required<FeaturesRecord<TenvVariables>> & BaseSystemFields
export type HooksResponse = Required<HooksRecord> & BaseSystemFields
export type UsersResponse = Required<UsersRecord> & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	authorizations: AuthorizationsRecord
	authorizationsExamples: AuthorizationsExamplesRecord
	crudExample: CrudExampleRecord
	features: FeaturesRecord
	hooks: HooksRecord
	users: UsersRecord
}

export type CollectionResponses = {
	authorizations: AuthorizationsResponse
	authorizationsExamples: AuthorizationsExamplesResponse
	crudExample: CrudExampleResponse
	features: FeaturesResponse
	hooks: HooksResponse
	users: UsersResponse
}