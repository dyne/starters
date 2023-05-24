import type { Actions } from './$types';
import crypto from 'node:crypto';

export const load = async ({ locals }) => {
	return {
		hmac: crypto.createHmac('sha256', locals.user?.email).digest().toString('base64')
	};
};

export const actions: Actions = {
	default: async () => {
		return {};
	}
};
