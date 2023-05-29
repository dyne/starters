import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getKeyringFromLocalStorage } from '$lib/auth/keypair';

export async function load() {
	if (browser) {
		const keyring = getKeyringFromLocalStorage();
		if (keyring) goto('/my');
	}
}
