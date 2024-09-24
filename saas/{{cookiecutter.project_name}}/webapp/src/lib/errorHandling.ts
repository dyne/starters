// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ClientResponseError } from 'pocketbase';

export function getErrorMessage(e: unknown): string {
	if (e instanceof Error) {
		return e.message;
	} else {
		return JSON.stringify(e);
	}
}

export function normalizeError(
	e: unknown,
	fallbacks: Partial<ClientResponseErrorData> = {}
): ClientResponseErrorData {
	let { status = 400, message = 'Unknown error', data = {} } = fallbacks;
	if (e instanceof ClientResponseError) {
		status = e.status;
		message = e.message;
		data = e.response.data;
	} else if (e instanceof Error) {
		message = e.message;
	} else {
		message = JSON.stringify(e);
	}
	return { status, message, data };
}

export type ClientResponseErrorData = {
	status: number;
	message: string;
	data: {
		[key: string]: {
			code: string;
			message: string;
		};
	};
};
