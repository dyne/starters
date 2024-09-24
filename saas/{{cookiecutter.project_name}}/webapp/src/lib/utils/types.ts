// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { BaseSystemFields } from '@/pocketbase/types';
import type { XCircle } from 'svelte-heros-v2';

/* TS utils */

export type ValueOf<T> = T[keyof T];

export type ArrayExtract<T> = T extends (infer U)[] ? U : T;
// Util to extract type from T | T[]

export type StringKeys<T> = Extract<keyof T, string>;

export type ReplaceType<T, K extends keyof T, NewType> = {
	[P in keyof T]: P extends K ? NewType : T[P];
};

/* Components */

export type IconComponent = typeof XCircle;

export interface Link {
	href: string;
	text: string;
}

export interface LinkWithIcon extends Link {
	icon?: IconComponent;
}

/* Pocketbase generics */

export type PBRecord = Record<string, unknown>;

// eslint-ignore
export type PBResponse = PBRecord & BaseSystemFields<any>; // eslint-disable-line

export type ExtractPBRecord<T> = T extends infer R & BaseSystemFields<unknown> ? R : never;
export type ExtractPBExpand<T> = T extends unknown & BaseSystemFields<infer E> ? E : never;
