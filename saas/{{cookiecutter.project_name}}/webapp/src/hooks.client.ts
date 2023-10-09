import { currentUser, pb, type AuthStoreModel } from '$lib/pocketbase';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(async () => {
	currentUser.set(pb.authStore.model as AuthStoreModel);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});
