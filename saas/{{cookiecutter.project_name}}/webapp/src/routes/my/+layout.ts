import { browser } from '$app/environment';
import { getKeypairFromLocalStorage } from '$lib/auth/generateKeypair';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (browser) {
		const keypair = getKeypairFromLocalStorage();
		if (!keypair) throw redirect(303, '/regenerate-keypair');
		else throw redirect(303, '/my/dashboard');
	}
}
