import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	throw redirect(303, `/my/organizations/${params.id}/general`);
};
