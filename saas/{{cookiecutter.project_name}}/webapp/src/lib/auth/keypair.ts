import type { UserAnswers } from './userQuestions';
import { zencode_exec } from 'zenroom';
import keypairoomClient from '../../../zenflows-crypto/src/keypairoomClient-8-9-10-11-12.zen?raw';
import keypairoomClientRecreateKeys from '../../../zenflows-crypto/src/keypairoomClientRecreateKeys.zen?raw';
import { pb } from '$lib/pocketbase';

//

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

//

async function zencodeExec<T>(contract: string, data: Record<string, unknown>): Promise<T> {
	const { result } = await zencode_exec(contract, { data: JSON.stringify(data) });
	return JSON.parse(result);
}

export async function generateKeypair(
	email: string,
	HMAC: string,
	answers: UserAnswers
): Promise<Keypair> {
	return await zencodeExec<Keypair>(keypairoomClient, {
		userChallenges: {
			whereParentsMet: answers.question1,
			nameFirstPet: answers.question2,
			nameFirstTeacher: answers.question3,
			whereHomeTown: answers.question4,
			nameMotherMaid: answers.question5
		},
		username: email,
		'seedServerSideShard.HMAC': HMAC
	});
}

export async function regenerateKeypair(seed: string, HMAC: string): Promise<Keypair> {
	return await zencodeExec<Keypair>(keypairoomClientRecreateKeys, {
		seed,
		'seedServerSideShard.HMAC': HMAC
	});
}

//

export async function getHMAC(email: string): Promise<string> {
	const response = await pb.send('/api/keypairoom-server', {
		body: JSON.stringify({ userData: { email } }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return response.hmac;
}

//

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
