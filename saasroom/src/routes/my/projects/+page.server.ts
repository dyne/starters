import type { LayoutServerLoad } from '../../$types';
import { currentUser } from '$lib/pocketbase';

export const load: LayoutServerLoad = async ({ locals }) => {
	await currentUser;
	return {
		projects: structuredClone(locals.pb.collection('projects'))
	};
};
