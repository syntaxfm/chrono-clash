<script lang="ts">
	import type { ScaleBand, ScaleLinear } from 'd3-scale';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { scaleBand } from 'd3-scale';

	type FlatPoint = {
		category: string;
		picker_id: string;
		picker_label: string;
		seconds: number;
		run_count: number;
	};

	type ChartContext = {
		data: Readable<FlatPoint[]>;
		xScale: Readable<ScaleBand<string>>;
		yScale: Readable<ScaleLinear<number, number>>;
		width: Readable<number>;
		height: Readable<number>;
	};

	const { data, xScale, yScale, width, height } = getContext<ChartContext>('LayerCake');

	let {
		pickerIds,
		pickerColor,
		maxSeconds
	}: {
		pickerIds: string[];
		pickerColor: Record<string, string>;
		maxSeconds: number;
	} = $props();

	const yTicks = $derived(Array.from({ length: 5 }, (_, i) => (maxSeconds / 4) * i));

	const innerScale = $derived(
		scaleBand<string>()
			.domain(pickerIds)
			.range([0, $xScale.bandwidth()])
			.paddingInner(0.2)
	);

	const dimensions = $derived($xScale.domain());
</script>

<g class="grid">
	{#each yTicks as t (t)}
		<line
			x1={0}
			x2={$width}
			y1={$yScale(t)}
			y2={$yScale(t)}
			stroke="var(--gray-2, oklch(0.92 0 0))"
			stroke-dasharray={t === 0 ? '0' : '2 4'}
		/>
	{/each}
</g>

<g class="y-axis">
	{#each yTicks as t (t)}
		<text x={-8} y={$yScale(t)} text-anchor="end" dominant-baseline="middle" class="tick">
			{t.toFixed(1)}s
		</text>
	{/each}
</g>

<g class="x-axis">
	{#each dimensions as dim (dim)}
		{@const cx = ($xScale(dim) ?? 0) + $xScale.bandwidth() / 2}
		<text x={cx} y={$height + 22} text-anchor="middle" class="axis-label">{dim}</text>
	{/each}
</g>

{#each $data as d (`${d.category}-${d.picker_id}`)}
	{#if d.run_count > 0}
		{@const bandX = $xScale(d.category) ?? 0}
		{@const offset = innerScale(d.picker_id) ?? 0}
		{@const bw = innerScale.bandwidth()}
		{@const yy = $yScale(d.seconds)}
		<g class="bar">
			<rect
				x={bandX + offset}
				y={yy}
				width={bw}
				height={$height - yy}
				rx="4"
				fill={pickerColor[d.picker_id]}
			/>
		</g>
	{/if}
{/each}

<style>
	.tick {
		font-size: 11px;
		fill: var(--gray-6, oklch(0.55 0 0));
		font-variant-numeric: tabular-nums;
	}
	.axis-label {
		font-size: 12px;
		font-weight: 700;
		fill: var(--fg);
	}
</style>
