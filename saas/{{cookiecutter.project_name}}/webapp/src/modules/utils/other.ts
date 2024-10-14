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
