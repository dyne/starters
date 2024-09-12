import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
// import { convertPbSchemaToJsonSchemaPlugin } from './src/modules/pocketbase/schema/pb-schema-to-json-schema';

export default defineConfig({
	plugins: [
		paraglide({ project: './project.inlang', outdir: './src/paraglide' }),
		sveltekit()
		// convertPbSchemaToJsonSchemaPlugin()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
