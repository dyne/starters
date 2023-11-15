import { redirect } from '@sveltejs/kit';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async ({ params }) => {
	if (await verifyUser()) throw redirect(303, `/${params.lang}/my`);
};
