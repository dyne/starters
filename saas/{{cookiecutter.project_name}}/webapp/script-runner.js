import { createServer } from 'vite';
// import { ViteNodeServer } from 'vite-node/server'
import { ViteNodeRunner } from 'vite-node/client';
import config from './svelte.config.js';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

//

run(
	'./src/modules/pocketbase/types/generate-extra.ts',
	'./src/modules/features/generate-features-list.ts'
);

//

/** @param {string[]} scripts */
async function run(...scripts) {
	const dirname = path.dirname(fileURLToPath(import.meta.url));

	const server = await createServer({
		root: dirname,
		resolve: {
			alias: config.kit.alias
		}
	});

	const runner = new ViteNodeRunner({
		root: server.config.root,
		base: server.config.base,
		fetchModule: (id) => server.ssrFetchModule(id)
	});

	for (const script of scripts) {
		try {
			await runner.executeFile(script);
		} catch (e) {
			console.log(e);
		}
	}

	await server.close();
}
