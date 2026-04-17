<script lang="ts">
	let { children } = $props();
</script>

<div class="layout-readable">
	{@render children?.()}
</div>

<style>
	.layout-readable {
		margin-block: var(--vs-xxl);
	}
</style>
