// Base types

export type GenericRecord = Record<string, unknown>;

// Logic operations

export type If<Condition extends boolean, IfTrue, IfFalse> = Condition extends true
	? IfTrue
	: IfFalse;

export type Not<Condition extends boolean> = Condition extends true ? false : true;

// Utils

export type ResolveType<T> = {
	[K in keyof T]: T[K];
} & unknown;
