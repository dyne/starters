import type { UserAnswers } from './userQuestions';
import { zencode_exec } from 'zenroom';
import keypairoomClient from '../../../zenflows-crypto/src/keypairoomClient-8-9-10-11-12.zen?raw';
import { pb } from '$lib/pocketbase';

export interface Keypair {
	seed: string;
	keyring: {
		eddsa: string;
		ethereum: string;
		reflow: string;
		bitcoin: string;
		ecdh: string;
	};
	ecdh_public_key: string;
	bitcoin_public_key: string;
	eddsa_public_key: string;
	reflow_public_key: string;
	ethereum_address: string;
}

export async function generateKeypair(
	email: string,
	HMAC: string,
	answers: UserAnswers
): Promise<Keypair> {
	const zenData = {
		userChallenges: {
			whereParentsMet: answers.question1,
			nameFirstPet: answers.question2,
			nameFirstTeacher: answers.question3,
			whereHomeTown: answers.question4,
			nameMotherMaid: answers.question5
		},
		username: email,
		'seedServerSideShard.HMAC': HMAC
	};
	const { result } = await zencode_exec(keypairoomClient, { data: JSON.stringify(zenData) });
	return JSON.parse(result);
}

export async function getHMAC(email: string) {
	const hmac = await pb.send('/keypairoom-server', {
		body: JSON.stringify({ userData: { email } }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	console.log('hmac', hmac);
	return hmac;
}

export const KEYPAIR_STORAGE_KEY = 'keypair';

export function saveKeypairToLocalStorage(keypair: Keypair) {
	localStorage.setItem(KEYPAIR_STORAGE_KEY, JSON.stringify(keypair));
}

export function getKeypairFromLocalStorage(): Keypair | null {
	const keypair = localStorage.getItem(KEYPAIR_STORAGE_KEY);
	if (keypair) {
		return JSON.parse(keypair);
	}
	return null;
}
