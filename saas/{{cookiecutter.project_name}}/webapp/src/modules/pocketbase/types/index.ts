/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorizations = "authorizations",
	AuthorizationsExamples = "authorizationsExamples",
	CrudExample = "crudExample",
	Features = "features",
	Hooks = "hooks",
	OrgAuthorizations = "orgAuthorizations",
	OrgJoinRequests = "orgJoinRequests",
	OrgRoles = "orgRoles",
	OrgInvites = "org_invites",
	Organizations = "organizations",
	SessionDataWebauthn = "sessionDataWebauthn",
	Users = "users",
	UsersPublicKeys = "users_public_keys",
	WebauthnCredentials = "webauthnCredentials",
	ZTestCollection = "z_test_collection",
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
	collection_id: string
	owner: RecordIdString
	record_id: string
	users: RecordIdString[]
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
	boolean?: boolean
	file_only_pdf_json: string[]
	image?: string
	multiselect?: CrudExampleMultiselectOptions[]
	owner?: RecordIdString
	relation?: RecordIdString[]
	relation_single: RecordIdString
	select: CrudExampleSelectOptions
	text: string
	text_with_regex?: string
	textarea?: HTMLString
}

export type FeaturesRecord<TenvVariables = unknown> = {
	active?: boolean
	envVariables?: null | TenvVariables
	name: string
}

export enum HooksEventOptions {
	"insert" = "insert",
	"update" = "update",
	"delete" = "delete",
}

export enum HooksActionTypeOptions {
	"command" = "command",
	"post" = "post",
	"sendmail" = "sendmail",
	"restroom-mw" = "restroom-mw",
}
export type HooksRecord = {
	action: string
	action_params?: string
	action_type: HooksActionTypeOptions
	collection: string
	disabled?: boolean
	event: HooksEventOptions
	expands?: string
}

export type OrgAuthorizationsRecord = {
	organization: RecordIdString
	role: RecordIdString
	user: RecordIdString
}

export enum OrgJoinRequestsStatusOptions {
	"pending" = "pending",
	"accepted" = "accepted",
	"rejected" = "rejected",
	"blocked" = "blocked",
}
export type OrgJoinRequestsRecord = {
	organization: RecordIdString
	reminders?: number
	status: OrgJoinRequestsStatusOptions
	user: RecordIdString
}

export type OrgRolesRecord = {
	level?: number
	name: string
}

export type OrgInvitesRecord = {
	declined?: boolean
	failed_email_send?: boolean
	organization: RecordIdString
	user?: RecordIdString
	user_email?: string
}

export type OrganizationsRecord = {
	avatar?: string
	description?: HTMLString
	name: string
}

export type SessionDataWebauthnRecord<Tsession = unknown> = {
	session?: null | Tsession
	user: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name: string
}

export type UsersPublicKeysRecord = {
	bitcoin_public_key: string
	ecdh_public_key: string
	eddsa_public_key: string
	es256_public_key: string
	ethereum_address: string
	owner: RecordIdString
	reflow_public_key: string
}

export type WebauthnCredentialsRecord<Tcredential = unknown> = {
	credential?: null | Tcredential
	description?: string
	user: RecordIdString
}

export enum ZTestCollectionSelectFieldOptions {
	"a" = "a",
	"b" = "b",
	"c" = "c",
}

export enum ZTestCollectionSelectMultiFieldOptions {
	"x" = "x",
	"y" = "y",
	"z" = "z",
}
export type ZTestCollectionRecord<Tjson_field = unknown> = {
	boolean_field?: boolean
	date_field?: IsoDateString
	email_field?: string
	file_field: string
	file_multi_field?: string[]
	json_field?: null | Tjson_field
	number_field: number
	relation_field?: RecordIdString
	relation_multi_field: RecordIdString[]
	richtext_field: HTMLString
	select_field?: ZTestCollectionSelectFieldOptions
	select_multi_field?: ZTestCollectionSelectMultiFieldOptions[]
	text_field: string
	url_field?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AuthorizationsResponse<Texpand = unknown> = Required<AuthorizationsRecord> & BaseSystemFields<Texpand>
export type AuthorizationsExamplesResponse<Texpand = unknown> = Required<AuthorizationsExamplesRecord> & BaseSystemFields<Texpand>
export type CrudExampleResponse<Texpand = unknown> = Required<CrudExampleRecord> & BaseSystemFields<Texpand>
export type FeaturesResponse<TenvVariables = unknown, Texpand = unknown> = Required<FeaturesRecord<TenvVariables>> & BaseSystemFields<Texpand>
export type HooksResponse<Texpand = unknown> = Required<HooksRecord> & BaseSystemFields<Texpand>
export type OrgAuthorizationsResponse<Texpand = unknown> = Required<OrgAuthorizationsRecord> & BaseSystemFields<Texpand>
export type OrgJoinRequestsResponse<Texpand = unknown> = Required<OrgJoinRequestsRecord> & BaseSystemFields<Texpand>
export type OrgRolesResponse<Texpand = unknown> = Required<OrgRolesRecord> & BaseSystemFields<Texpand>
export type OrgInvitesResponse<Texpand = unknown> = Required<OrgInvitesRecord> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
export type SessionDataWebauthnResponse<Tsession = unknown, Texpand = unknown> = Required<SessionDataWebauthnRecord<Tsession>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type UsersPublicKeysResponse<Texpand = unknown> = Required<UsersPublicKeysRecord> & BaseSystemFields<Texpand>
export type WebauthnCredentialsResponse<Tcredential = unknown, Texpand = unknown> = Required<WebauthnCredentialsRecord<Tcredential>> & BaseSystemFields<Texpand>
export type ZTestCollectionResponse<Tjson_field = unknown, Texpand = unknown> = Required<ZTestCollectionRecord<Tjson_field>> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	authorizations: AuthorizationsRecord
	authorizationsExamples: AuthorizationsExamplesRecord
	crudExample: CrudExampleRecord
	features: FeaturesRecord
	hooks: HooksRecord
	orgAuthorizations: OrgAuthorizationsRecord
	orgJoinRequests: OrgJoinRequestsRecord
	orgRoles: OrgRolesRecord
	org_invites: OrgInvitesRecord
	organizations: OrganizationsRecord
	sessionDataWebauthn: SessionDataWebauthnRecord
	users: UsersRecord
	users_public_keys: UsersPublicKeysRecord
	webauthnCredentials: WebauthnCredentialsRecord
	z_test_collection: ZTestCollectionRecord
}

export type CollectionResponses = {
	authorizations: AuthorizationsResponse
	authorizationsExamples: AuthorizationsExamplesResponse
	crudExample: CrudExampleResponse
	features: FeaturesResponse
	hooks: HooksResponse
	orgAuthorizations: OrgAuthorizationsResponse
	orgJoinRequests: OrgJoinRequestsResponse
	orgRoles: OrgRolesResponse
	org_invites: OrgInvitesResponse
	organizations: OrganizationsResponse
	sessionDataWebauthn: SessionDataWebauthnResponse
	users: UsersResponse
	users_public_keys: UsersPublicKeysResponse
	webauthnCredentials: WebauthnCredentialsResponse
	z_test_collection: ZTestCollectionResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'authorizations'): RecordService<AuthorizationsResponse>
	collection(idOrName: 'authorizationsExamples'): RecordService<AuthorizationsExamplesResponse>
	collection(idOrName: 'crudExample'): RecordService<CrudExampleResponse>
	collection(idOrName: 'features'): RecordService<FeaturesResponse>
	collection(idOrName: 'hooks'): RecordService<HooksResponse>
	collection(idOrName: 'orgAuthorizations'): RecordService<OrgAuthorizationsResponse>
	collection(idOrName: 'orgJoinRequests'): RecordService<OrgJoinRequestsResponse>
	collection(idOrName: 'orgRoles'): RecordService<OrgRolesResponse>
	collection(idOrName: 'org_invites'): RecordService<OrgInvitesResponse>
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>
	collection(idOrName: 'sessionDataWebauthn'): RecordService<SessionDataWebauthnResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'users_public_keys'): RecordService<UsersPublicKeysResponse>
	collection(idOrName: 'webauthnCredentials'): RecordService<WebauthnCredentialsResponse>
	collection(idOrName: 'z_test_collection'): RecordService<ZTestCollectionResponse>
}
