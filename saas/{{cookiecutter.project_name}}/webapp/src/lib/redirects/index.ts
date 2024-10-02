const REDIRECT_INTENT_KEY = 'org-invite';

export function saveRedirectIntent(organizationId: string) {
	sessionStorage.setItem(REDIRECT_INTENT_KEY, organizationId);
}

export function getRedirectIntent() {
	return sessionStorage.getItem(REDIRECT_INTENT_KEY);
}
