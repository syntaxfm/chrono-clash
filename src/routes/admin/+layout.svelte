<script lang="ts">
	import { PasskeyAuthBasicUI } from 'jazz-tools/svelte';

	let { children } = $props();
</script>

<PasskeyAuthBasicUI appName="Rate Date">
	{@render children?.()}
</PasskeyAuthBasicUI>
