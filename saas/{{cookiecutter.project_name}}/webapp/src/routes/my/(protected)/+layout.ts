import { getKeyringFromLocalStorage } from '$lib/auth/keypair';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const keyring = getKeyringFromLocalStorage();
	if (!keyring) throw redirect(303, '/my/keypairoom/regenerate');
}
