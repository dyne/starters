import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getKeyringFromLocalStorage } from '$lib/auth/keypair';
import { superValidate } from 'sveltekit-superforms/client';
import { z } from 'zod';

const schema = z.object({
	seed: z.string()
});

export async function load() {
	// if (browser) {
	// 	const keyring = getKeyringFromLocalStorage();
	// 	if (keyring) goto('/my');
	// }

	const form = await superValidate(schema);
	return { schema, form };
}
