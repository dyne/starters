// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import {
	Collections,
	type UsersPublicKeysRecord,
	type UsersPublicKeysResponse
} from '$lib/pocketbase/types';
import _ from 'lodash';
import type { Keypair } from './keypair';

export type PublicKeys = Omit<UsersPublicKeysRecord, 'owner'>;

export function getPublicKeysFromKeypair(keypair: Keypair): PublicKeys {
	const publicKeys = _.cloneDeep(keypair);
	// @ts-expect-error Cannot use delete on required field
	delete publicKeys.seed;
	// @ts-expect-error Cannot use delete on required field
	delete publicKeys.keyring;
	return publicKeys;
}

export async function getUserPublicKeys(userId: string | undefined = undefined) {
	const id = userId ?? pb.authStore.model?.id ?? '';
	try {
		return await pb
			.collection(Collections.UsersPublicKeys)
			.getFirstListItem<UsersPublicKeysResponse>(`owner.id = '${id}'`);
	} catch (e) {
		return undefined;
	}
}

export async function saveUserPublicKeys(publicKeys: PublicKeys) {
	const data: UsersPublicKeysRecord = {
		...publicKeys,
		owner: pb.authStore.model?.id
	};
	await pb.collection('users_public_keys').create(data);
}
