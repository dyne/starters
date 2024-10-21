import { resolveRoute } from '$lib/i18n';
import type { Page } from '@sveltejs/kit';

export function getJsonDataSize(data: unknown): number {
	return new Blob([JSON.stringify(data)]).size;
}

export function normalizeError(e: unknown): string {
	if (e instanceof Error) {
		return e.message;
	} else {
		return JSON.stringify(e);
	}
}

export function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function createDummyFile(options: { filename?: string; size?: number; mime?: string } = {}) {
	const { filename = 'file.txt', size = 10, mime = 'text/plain' } = options;
	return new File(['a'.repeat(size)], filename, {
		type: mime,
		lastModified: Date.now()
	});
}

//

export function isLinkActive(href: string, page: Page, includeSubpages = false) {
	const isExact = page.url.pathname == resolveRoute(href, page.url);
	const isParent = page.url.pathname.includes(href);
	return includeSubpages ? isParent : isExact;
}

//

export function removeTrailingSlash(text: string) {
	if (text.endsWith('/')) {
		return text.slice(0, -1);
	}
	return text;
}
