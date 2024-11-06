import { currentUser, pb, type AuthStoreModel } from '@/pocketbase';

import { version } from '$app/environment';
import { appTitle } from '@/utils/strings';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model as AuthStoreModel);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false });
});

console.info(`${appTitle} version: 🔖 ${version}`);
