import PocketBase from 'pocketbase';
import fs from 'fs';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import prettier from 'prettier';

// -- Instructions -- //

const OUTPUT_FILE_PATH = getCurrentWorkingDirectory() + '/collections-models.generated.ts';

const pb = initPocketbase();
pocketbaseAdminLogin()
	.then(() => pb.collections.getFullList())
	.then((config) => {
		const code = `export default ${JSON.stringify(config, null, 2)} as const`;
		return prettier.format(code, { parser: 'typescript' });
	})
	.then((config) => fs.writeFileSync(OUTPUT_FILE_PATH, config))
	.then(() => console.log(`📦 Created pocketbase definitions at ${OUTPUT_FILE_PATH}`));

// -- Functions -- //

function initPocketbase() {
	const { PUBLIC_POCKETBASE_URL } = process.env;
	if (!PUBLIC_POCKETBASE_URL) throw new Error('[ENV] Missing PUBLIC_POCKETBASE_URL');
	return new PocketBase(PUBLIC_POCKETBASE_URL);
}

async function pocketbaseAdminLogin() {
	const { PB_ADMIN_USER, PB_ADMIN_PASS } = process.env;
	if (!PB_ADMIN_USER || !PB_ADMIN_PASS)
		throw new Error('[ENV] Missing PB_ADMIN_USER and PB_ADMIN_PASS');
	await pb.admins.authWithPassword(PB_ADMIN_USER, PB_ADMIN_PASS);
}

function getCurrentWorkingDirectory() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return __dirname;
}
