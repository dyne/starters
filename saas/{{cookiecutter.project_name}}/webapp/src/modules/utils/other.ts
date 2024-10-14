export function getJsonDataSize(data: unknown): number {
	return new Blob([JSON.stringify(data)]).size;
}
