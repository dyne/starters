import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
			passwordConfirm: string;
		};

		const u = locals.pb.collection('users');

		try {
			await u.create(data);
			await u.authWithPassword(data.email, data.password);
			await u.requestVerification(data.email);
		} catch (e) {
			console.log(e);
			return fail(400, { error: true, message: e.data.message, data: e.data.data });
		}

		throw redirect(303, '/my/keypairoom');
	}
};
