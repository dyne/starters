import { pb } from '$lib/pocketbase';

export const load = async () => {
	const item = await pb.collection('CrudExample_AllFields').getOne('21wbzfmtmej72gm');
	return { item };
};
