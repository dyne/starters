// Base types

export type GenericRecord = Record<string, unknown>;

export type MaybePromise<T> = T | Promise<T>;

// Logic operations

export type If<Condition extends boolean, IfTrue, IfFalse> = Condition extends true
	? IfTrue
	: IfFalse;

export type Not<Condition extends boolean> = Condition extends true ? false : true;

//

export type IsArray<T> = T extends Array<unknown> ? true : false;
