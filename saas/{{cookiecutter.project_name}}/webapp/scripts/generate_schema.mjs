import PocketBase from 'pocketbase';
import fs from 'fs';
import 'dotenv/config'

const pb = new PocketBase('http://127.0.0.1:8090');
const {PB_ADMIN_USER, PB_ADMIN_PASS} = process.env;

await pb.admins.authWithPassword(PB_ADMIN_USER, PB_ADMIN_PASS);

// after the above you can also access the auth data from the authStore
const getSchema = async () => {
	return JSON.stringify(await pb.collections.getFullList(), null, 8)
}

fs.writeFileSync('./src/lib/schema/pb_schema.json', await getSchema())
