import type { Actions } from '@sveltejs/kit';
import { devLog } from '$lib/utils/devLog';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		devLog(await request.formData());
		// const data = Object.fromEntries(await request.formData()) as {
		// 	email: string;
		// 	password: string;
		// 	passwordConfirm: string;
		// };

		// const data2: { key_derivation: string } = await createPBKDF({
		// 	email: data.email,
		// 	password: data.password
		// });

		// const u = locals.pb.collection(Collections.Users);

		// try {
		// 	await u.create(data);
		// 	await u.authWithPassword(data.email, data.password);
		// 	await u.requestVerification(data.email);
		// } catch (e) {
		// 	console.log(e);
		// 	return fail(400, { error: true, message: e.data.message, data: e.data.data });
		// }

		// throw redirect(303, '/my/dashboard');
	}
};
