<script lang="ts">
	import { PasskeyAuthBasicUI } from 'jazz-tools/svelte';

	let { children } = $props();
</script>

<div class="stack">
	<header class="header border">
		<h1 class="h6">Chrono Clash</h1>
	</header>

	<div class="admin-layout layout-readable center">
		<PasskeyAuthBasicUI appName="Rate Date">
			{@render children?.()}
		</PasskeyAuthBasicUI>
	</div>
</div>
