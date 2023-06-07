import { pb } from '$lib/pocketbase';
import type { Collections } from '$lib/pocketbase-types';

export const load = async ({ params }) => {
	const collectionName = params.collection as Collections;
	const items = await pb.collection(collectionName).getFullList({ sort: '-created' });
	return { items };
};
