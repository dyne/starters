import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getKeypairFromLocalStorage } from '$lib/auth/generateKeypair';

export async function load() {
	if (browser) {
		const keypair = getKeypairFromLocalStorage();
		if (keypair) goto('/my');
	}
}
