import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://61752b56752b0de375530c4c97afb1ac@o4505358925561856.ingest.us.sentry.io/4511230930780160',

	tracesSampleRate: 1.0,

	// Enable logs to be sent to Sentry
	enableLogs: true

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});
