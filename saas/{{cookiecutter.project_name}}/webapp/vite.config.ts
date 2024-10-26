import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglide({ project: './project.inlang', outdir: './src/modules/i18n/paraglide' })
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
