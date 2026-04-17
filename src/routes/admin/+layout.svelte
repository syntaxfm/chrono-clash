<script lang="ts">
	import { PasskeyAuthBasicUI } from 'jazz-tools/svelte';

	let { children } = $props();
</script>

<div class="admin-layout layout-readable center">
	<PasskeyAuthBasicUI appName="Rate Date">
		{@render children?.()}
	</PasskeyAuthBasicUI>
</div>
