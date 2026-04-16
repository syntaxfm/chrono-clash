import {
	handleErrorWithSentry,
	initCloudflareSentryHandle,
	sentryHandle
} from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

// Cloudflare Workers init comes first in the sequence (per Sentry docs for
// SvelteKit + Cloudflare). The Node-style `Sentry.init` in
// instrumentation.server.ts doesn't work here — @sentry/sveltekit's Node
// build pulls APIs that the Workers runtime can't satisfy even with
// nodejs_compat, so the Cloudflare handle replaces it.
export const handle = sequence(
	initCloudflareSentryHandle({
		dsn: 'https://61752b56752b0de375530c4c97afb1ac@o4505358925561856.ingest.us.sentry.io/4511230930780160',
		tracesSampleRate: 1.0,
		enableLogs: true,
		sendDefaultPii: true
	}),
	sentryHandle()
);

export const handleError = handleErrorWithSentry();
