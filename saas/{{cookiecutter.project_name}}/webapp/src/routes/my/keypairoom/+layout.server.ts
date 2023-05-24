import crypto from 'node:crypto';

export const load = async ({ locals }) => {
	return {
		hmac: crypto.createHmac('sha256', locals.user?.email).digest().toString('base64')
	};
};
