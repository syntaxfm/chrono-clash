import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: 'syntax-fm',
			project: 'rate-date'
		}),
		sveltekit()
	],
	// SSR bundle targets Cloudflare Workers via adapter-cloudflare; tell Vite
	// to prefer the `worker` export condition so packages like
	// @sentry/sveltekit resolve to their Workers-safe ESM entry instead of
	// the Node entry (which pulls node:module / createRequire into the
	// bundle and fails at runtime on Workers).
	ssr: {
		resolve: {
			conditions: ['worker', 'browser', 'module', 'import', 'default'],
			externalConditions: ['worker', 'browser', 'module', 'import', 'default']
		}
	}
});
