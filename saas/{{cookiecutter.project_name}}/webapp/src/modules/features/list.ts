export const Features = {
	KEYPAIROOM: 'keypairoom',
	DID: 'DID',
	AUTH: 'auth',
	MAINTENANCE: 'maintenance',
	ORGANIZATIONS: 'organizations',
	WEBAUTHN: 'webauthn',
} as const;

export type Feature = typeof Features [keyof typeof Features];