// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export function downloadFileFromUrl(url: string, fileName: string) {
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.target = '_blank';

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	URL.revokeObjectURL(url);
}

export function downloadBlob(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob);
	downloadFileFromUrl(url, fileName);
}

export async function imageSrcToBlob(src: string) {
	const img = new Image();
	img.src = src;

	const responsePromise = await fetch(img.src);
	const blob = await responsePromise.blob();

	return blob;
}

export async function dowloadResponseAsZip(response: Response, fileName: string) {
	if (response.ok) {
		const blob = new Blob([await response.arrayBuffer()], { type: 'application/zip' });
		downloadBlob(blob, fileName);
	}
}
