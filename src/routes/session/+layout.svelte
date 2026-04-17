<script lang="ts">
	let { children } = $props();
</script>

<div class="layout-readable center">
	{@render children?.()}
</div>
