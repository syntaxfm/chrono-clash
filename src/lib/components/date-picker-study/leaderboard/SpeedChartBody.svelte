<script lang="ts">
	import type { ScaleBand, ScaleLinear } from 'd3-scale';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';

	type SpeedRow = {
		picker_id: string;
		picker_label: string;
		mean_seconds: number;
	};

	type ChartContext = {
		data: Readable<SpeedRow[]>;
		xScale: Readable<ScaleLinear<number, number>>;
		yScale: Readable<ScaleBand<string>>;
		xGet: Readable<(d: SpeedRow) => number>;
		height: Readable<number>;
	};

	const { data, xScale, yScale, xGet, height } = getContext<ChartContext>('LayerCake');

	let {
		pickerColor,
		maxSeconds
	}: { pickerColor: Record<string, string>; maxSeconds: number } = $props();

	const ticks = $derived(Array.from({ length: 5 }, (_, i) => (maxSeconds / 4) * i));
</script>

<g class="grid">
	{#each ticks as t (t)}
		<line
			x1={$xScale(t)}
			x2={$xScale(t)}
			y1={0}
			y2={$height}
			stroke="var(--gray-2, oklch(0.92 0 0))"
			stroke-dasharray="2 4"
		/>
	{/each}
</g>

<g class="ticks">
	{#each ticks as t (t)}
		<text x={$xScale(t)} y={$height + 20} text-anchor="middle" class="tick">
			{t.toFixed(1)}s
		</text>
	{/each}
</g>

{#each $data as d, i (d.picker_id)}
	{@const y = $yScale(d.picker_label) ?? 0}
	{@const h = $yScale.bandwidth()}
	{@const w = $xGet(d)}
	{@const x0 = $xScale(0)}
	{@const xFull = $xScale(maxSeconds)}
	<g class="row">
		<rect
			x={x0}
			y={y}
			width={xFull - x0}
			height={h}
			rx={h / 2}
			fill="var(--gray-1, oklch(0.96 0 0))"
		/>
		<rect x={x0} y={y} width={w - x0} height={h} rx={h / 2} fill={pickerColor[d.picker_id]} />
		<text x={x0 - 12} y={y + h / 2} text-anchor="end" dominant-baseline="middle" class="label">
			{#if i === 0}★{/if}
			{d.picker_label}
		</text>
		<text x={w + 8} y={y + h / 2} dominant-baseline="middle" class="value">
			{d.mean_seconds.toFixed(2)}s
		</text>
	</g>
{/each}

<style>
	.tick {
		font-size: 12px;
		fill: var(--gray-6, oklch(0.55 0 0));
		font-variant-numeric: tabular-nums;
	}
	.label {
		font-size: 14px;
		font-weight: 700;
		fill: var(--fg);
	}
	.value {
		font-size: 14px;
		font-weight: 700;
		fill: var(--fg);
		font-variant-numeric: tabular-nums;
	}
</style>
