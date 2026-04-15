<script lang="ts">
	import '@drop-in/graffiti';
	import type { SyncConfig } from 'jazz-tools';
	import { JazzSvelteProvider } from 'jazz-tools/svelte';

	let { children } = $props();
	const sync: SyncConfig = { peer: 'ws://127.0.0.1:4200' };
</script>

<JazzSvelteProvider {sync}>
	<main>
		{@render children?.()}
	</main>
</JazzSvelteProvider>
