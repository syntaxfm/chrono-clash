<script lang="ts">
	import '@drop-in/graffiti';
	import './style.css';
	import type { SyncConfig } from 'jazz-tools';
	import { JazzSvelteProvider } from 'jazz-tools/svelte';

	import { RateDateAccount } from '$lib/schema';
	import { PUBLIC_JAZZ_API_KEY } from '$env/static/public';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();
	const sync: SyncConfig = { peer: `wss://cloud.jazz.tools/?key=${PUBLIC_JAZZ_API_KEY}` };

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<JazzSvelteProvider {sync} AccountSchema={RateDateAccount}>
	<main>
		{@render children?.()}
	</main>
</JazzSvelteProvider>
