import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { formatUnknownException } from '$lib/errorHandling';
import { log } from '$lib/utils/devLog';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (e) {
			log(e);
			const err = formatUnknownException(e, 400, 'Login not successful');
			return fail(err.status, { email: data.email, error: err.message });
		}

		throw redirect(303, '/my/dashboard');
	}
};
