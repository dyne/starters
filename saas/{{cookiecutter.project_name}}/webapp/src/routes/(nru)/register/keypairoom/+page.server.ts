import { fail, type Actions } from '@sveltejs/kit';
import { generateKeypair } from '$lib/auth/generateKeypair';
import { userQuestionsKeys as qk } from '$lib/auth/userQuestions';
import crypto from 'node:crypto';
import { Collections } from '$lib/pocketbase-types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const HMAC = crypto.createHmac('sha256', email).digest('base64'); // <- here we should get HMAC from a server request?
		const { seed } = await generateKeypair(email, HMAC, {
			question1: formData.get(qk.question1) as string,
			question2: formData.get(qk.question2) as string,
			question3: formData.get(qk.question3) as string,
			question4: formData.get(qk.question4) as string,
			question5: formData.get(qk.question5) as string
		});

		const u = locals.pb.collection(Collections.Users);
		const data = {
			email,
			password: seed,
			passwordConfirm: seed
		};

		try {
			await u.create(data);
			await u.authWithPassword(data.email, data.password);
			await u.requestVerification(data.email);

			return { seed };
		} catch (e) {
			console.log(e);
			return fail(400, { error: true, message: e.data.message, data: e.data.data });
		}
	}
};
