/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Projects = "projects",
	Signatures = "signatures",
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

export type ProjectsRecord = {
	title?: string
	description?: HTMLString
	owner?: RecordIdString
}

export type SignaturesRecord = {
	file?: string
	title?: string
	description?: HTMLString
	owner?: RecordIdString
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ProjectsResponse<Texpand = unknown> = ProjectsRecord & BaseSystemFields<Texpand>
export type SignaturesResponse<Texpand = unknown> = SignaturesRecord & BaseSystemFields<Texpand>
export type UsersResponse = UsersRecord & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	projects: ProjectsRecord
	signatures: SignaturesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	projects: ProjectsResponse
	signatures: SignaturesResponse
	users: UsersResponse
}