import { pb } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';
import { Collections, type FeaturesResponse } from '$lib/pocketbase-types';

export const handle: Handle = async ({ event, resolve }) => {
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
		} catch (_) {
			pb.authStore.clear();
		}
	}

	event.locals.pb = pb;
	event.locals.user = structuredClone(pb.authStore.model);

	const features = await pb.collection(Collections.Features).getFullList<FeaturesResponse>();
	event.locals.features = structuredClone(features);

	const response = await resolve(event);
	response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));

	return response;
};
