<script lang="ts">
	import '@drop-in/graffiti';
	import type { SyncConfig } from 'jazz-tools';
	import { JazzSvelteProvider } from 'jazz-tools/svelte';

	import { RateDateAccount } from '$lib/schema';
	import { PUBLIC_JAZZ_API_KEY } from '$env/static/public';

	let { children } = $props();
	const sync: SyncConfig = { peer: `wss://cloud.jazz.tools/?key=${PUBLIC_JAZZ_API_KEY}` };
</script>

<JazzSvelteProvider {sync} AccountSchema={RateDateAccount}>
	<main>
		{@render children?.()}
	</main>
</JazzSvelteProvider>
