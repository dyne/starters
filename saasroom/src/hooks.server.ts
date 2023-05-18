import { pb } from '$lib/pocketbase';
import { redirect, type Handle } from '@sveltejs/kit';
import { Collections, type FeatureFlagsResponse } from '$lib/pocketbase-types';

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

	// protected paths
	if (event.url.pathname.startsWith('/my')) {
		if (!event.locals.user) {
			throw redirect(303, '/');
		}
		// admin
		if (event.url.pathname.startsWith('/protected/admin')) {
			if (event.locals.user.role !== 'ADMIN') {
				throw redirect(303, '/protected');
			}
		}
	}

	const featureFlags = await pb
		.collection(Collections.FeatureFlags)
		.getFullList<FeatureFlagsResponse>();
	event.locals.featureFlags = structuredClone(featureFlags);

	const response = await resolve(event);
	response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));
	return response;
};
