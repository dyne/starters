// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Features } from './list';
import { pb } from '@/pocketbase';
import { Collections, type FeaturesResponse } from '@/pocketbase/types';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

//

export const featureFlags = writable<FeatureFlags>();

export type FeatureKeys = keyof typeof Features;
export type FeatureFlags = Record<FeatureKeys, boolean>;

export async function loadFeatureFlags(fetchFn = fetch): Promise<FeatureFlags> {
	const flags: Partial<FeatureFlags> = {};

	const list = await pb
		.collection(Collections.Features)
		.getFullList<FeaturesResponse>({ requestKey: null, fetch: fetchFn });

	for (const [key, name] of Object.entries(Features)) {
		const feature = list.find((f) => f.name === name);
		flags[key as FeatureKeys] = feature?.active ?? false;
	}

	if (browser) featureFlags.set(flags as FeatureFlags);
	return flags as FeatureFlags;
}

export * from './list';
