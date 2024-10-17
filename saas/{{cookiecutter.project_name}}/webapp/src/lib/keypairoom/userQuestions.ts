// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { z } from 'zod';
import { m } from '$lib/i18n';
import _ from 'lodash';
import { String } from 'effect';

//

export const userChallengesSchema = z
	.object({
		whereParentsMet: z.string(),
		nameFirstPet: z.string(),
		whereHomeTown: z.string(),
		nameFirstTeacher: z.string(),
		nameMotherMaid: z.string()
	})
	.partial()
	.refine((data) => {
		return Object.values(data).filter((v) => String.isNonEmpty(v)).length >= 3;
	}, 'AT_LEAST_THREE_QUESTIONS');

export type UserChallenges = z.infer<typeof userChallengesSchema>;
export type UserChallenge = keyof UserChallenges;

export const userChallenges: Array<{ id: UserChallenge; text: string }> = [
	{ id: 'whereParentsMet', text: m.whereParentsMet() },
	{ id: 'nameFirstPet', text: m.nameFirstPet() },
	{ id: 'whereHomeTown', text: m.whereHomeTown() },
	{ id: 'nameFirstTeacher', text: m.nameFirstTeacher() },
	{ id: 'nameMotherMaid', text: m.nameMotherMaid() }
];

//

const ZENROOM_NULL = 'null';

export function formatAnswersForZenroom(data: UserChallenges): UserChallenges {
	return _.mapValues(data, (v) => (isStringNonEmpty(v) ? v : ZENROOM_NULL));
}

function isStringNonEmpty(string: string | undefined) {
	if (!string) return false;
	else return String.isNonEmpty(string);
}
