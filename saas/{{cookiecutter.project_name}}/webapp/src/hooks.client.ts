import { currentUser, pb, type AuthStoreModel } from '$lib/pocketbase';
import { Collections } from '$lib/pocketbase/types';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(async () => {
	// TODO: Add all roles in all organizations for the user
	currentUser.set(pb.authStore.model as AuthStoreModel);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});
