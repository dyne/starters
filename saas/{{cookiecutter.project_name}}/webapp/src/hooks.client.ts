import { currentUser, pb, type AuthStoreModel } from '$lib/pocketbase';
import { fetchUserAuthorizations } from '$lib/roles';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(async () => {
	currentUser.set(pb.authStore.model as AuthStoreModel);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
	// const userId = pb.authStore.model?.id;
	// if (userId) await fetchUserAuthorizations(userId);
});
