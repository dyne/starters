import type { PBResponse } from '$lib/utils/types';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

//@ts-ignore
import { Slangroom } from '@slangroom/core';
//@ts-ignore
import { httpPlugins } from '@slangroom/http';

const PB = PUBLIC_POCKETBASE_URL || 'http://localhost:8090';

const slangroom = new Slangroom(httpPlugins);

export type SlangroomResponse<T extends Record<string, unknown>> = Promise<{
	status: number;
	result: T;
}>;

export interface SlangroomRequest<T = undefined> {
	token: string;
	id: string;
	data: T;
}

export const authWithPassword = async (username: string, password: string) => {
	const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string dictionary' named 'auth'
When I write string 'api/collections/users/auth-with-password' in 'path'
When I append 'path' to 'pb'
Then print data
Then I connect to 'pb' and send object 'auth' and do post and output into 'auth_token'
`;
	const res = await slangroom.execute(script, {
		data: {
			pb: PB,
			auth: { identity: username, password }
		}
	});
	return res.result.auth_token;
};

// WARNING: not safe against injection
const apiById = async (
	before: string,
	after: string,
	token: string,
	rest?: FormData | Record<string, string>
): SlangroomResponse<PBResponse> => {
	const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
When I write string '${before}' in 'path'
When I write string '${after}' in 'end_filter'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
When I append 'end_filter' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and do get and output into 'http_result'
`;
	try {
		const res = await slangroom.execute(script, {
			data: {
				pb: PB,
				headers: {
					authorization: 'Bearer ' + token
				},
				...rest
			}
		});
		// TODO: check errors
		return res.result.http_result.result;
	} catch (e: any) {
		console.log(e);
		throw new Error(e);
	}
};

// List of services of my org
// TODO: manage pagination
export const organizationServices = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById('api/collections/services/records?filters=(organization="', '")', token, {
		id: id
	});
};

// List of the orgs I'm part of
// TODO: manage pagination
export const orgAuthorizations = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById(
		'api/collections/orgAuthorizations/records?filter=(user="',
		'")&&expand=organization&&fields=expand.organization.name,expand.organization.id',
		token,
		{ id: id }
	);
};

// List of WebAuthn sessions/devices
// TODO: manage pagination
export const webauthnCreds = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById('api/collections/webauthnCredentials/records?filter=(user="', '")', token, {
		id: id
	});
};
export const webauthnSessions = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById('api/collections/sessionDataWebauthn/records?filter=(user="', '")', token, {
		id: id
	});
};

// My profile info
export const myProfile = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById('api/collections/users/records/', '', token, { id: id });
};
export const updateProfile = async (req: SlangroomRequest<FormData | Record<string, string>>) => {
	const { id, token, data } = req;
	const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
Given I have a 'string dictionary' named 'user_data'
When I write string 'api/collections/users/records/' in 'path'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and send object 'user_data' and do patch and output into 'http_result'
`;
	const res = await slangroom.execute(script, {
		data: {
			pb: PB,
			headers: {
				authorization: 'Bearer ' + token
			},
			id: id,
			user_data: data
		}
	});
	// TODO: check errors
	return res.result;
};
