<script lang="ts">
	import { PasskeyAuthBasicUI } from 'jazz-tools/svelte';

	let { children } = $props();
</script>

<PasskeyAuthBasicUI appName="Rate Date">
	<div class="admin-layout layout-readable center">
		{@render children?.()}
	</div>
</PasskeyAuthBasicUI>
