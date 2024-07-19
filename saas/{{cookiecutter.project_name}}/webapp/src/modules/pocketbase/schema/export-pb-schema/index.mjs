import PocketBase from 'pocketbase';
import fs from 'fs';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Config

const OUTPUT_FILE_PATH = getCurrentWorkingDirectory() + '/pb-schema.generated.json';

// Instructions

const pb = initPocketbase();
await pocketbaseAdminLogin();

const schema = await getSchema();
writeFile(OUTPUT_FILE_PATH, formatSchema(schema));

console.log(`📦 Created pocketbase definitions at ${OUTPUT_FILE_PATH}`);

// Functions

function initPocketbase() {
	const { PUBLIC_POCKETBASE_URL } = process.env;
	return new PocketBase(PUBLIC_POCKETBASE_URL);
}

async function pocketbaseAdminLogin() {
	const { PB_ADMIN_USER, PB_ADMIN_PASS } = process.env;
	await pb.admins.authWithPassword(PB_ADMIN_USER, PB_ADMIN_PASS);
}

function getSchema() {
	return pb.collections.getFullList();
}

function formatSchema(schema) {
	return JSON.stringify(schema, null, 2);
}

function writeFile(path, content) {
	fs.writeFileSync(path, content);
}

function getCurrentWorkingDirectory() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return __dirname;
}
