<script lang="ts">
	import type { ScaleBand, ScaleLinear } from 'd3-scale';
	import type { Readable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { scaleBand } from 'd3-scale';

	type FlatPoint = {
		prompt: string;
		category: string;
		picker_id: string;
		picker_label: string;
		seconds: number;
		run_count: number;
	};

	type ChartContext = {
		data: Readable<FlatPoint[]>;
		xScale: Readable<ScaleLinear<number, number>>;
		yScale: Readable<ScaleBand<string>>;
		height: Readable<number>;
	};

	const { data, xScale, yScale, height } = getContext<ChartContext>('LayerCake');

	let {
		pickerIds,
		pickerColor,
		maxSeconds
	}: {
		pickerIds: string[];
		pickerColor: Record<string, string>;
		maxSeconds: number;
	} = $props();

	const xTicks = $derived(Array.from({ length: 5 }, (_, i) => (maxSeconds / 4) * i));

	const innerScale = $derived(
		scaleBand<string>().domain(pickerIds).range([0, $yScale.bandwidth()]).paddingInner(0.2)
	);

	const prompts = $derived($yScale.domain());
</script>

<g class="grid">
	{#each xTicks as t (t)}
		<line
			x1={$xScale(t)}
			x2={$xScale(t)}
			y1={0}
			y2={$height}
			stroke="var(--gray-2, oklch(0.92 0 0))"
			stroke-dasharray={t === 0 ? '0' : '2 4'}
		/>
	{/each}
</g>

<g class="x-axis">
	{#each xTicks as t (t)}
		<text x={$xScale(t)} y={$height + 20} text-anchor="middle" class="tick">
			{t.toFixed(1)}s
		</text>
	{/each}
</g>

<g class="y-axis">
	{#each prompts as prompt (prompt)}
		{@const cy = ($yScale(prompt) ?? 0) + $yScale.bandwidth() / 2}
		<text x={-12} y={cy} text-anchor="end" dominant-baseline="middle" class="axis-label">
			{prompt.length > 32 ? `${prompt.slice(0, 30)}…` : prompt}
			<title>{prompt}</title>
		</text>
	{/each}
</g>

{#each $data as d (`${d.prompt}-${d.picker_id}`)}
	{#if d.run_count > 0}
		{@const bandY = $yScale(d.prompt) ?? 0}
		{@const offset = innerScale(d.picker_id) ?? 0}
		{@const bh = innerScale.bandwidth()}
		{@const barWidth = $xScale(d.seconds)}
		<g class="bar">
			<rect
				x={0}
				y={bandY + offset}
				width={barWidth}
				height={bh}
				rx="4"
				fill={pickerColor[d.picker_id]}
			>
				<title>{d.picker_label}: {d.seconds.toFixed(2)}s ({d.run_count} runs)</title>
			</rect>
			{#if barWidth > 40}
				<text
					x={barWidth - 8}
					y={bandY + offset + bh / 2}
					text-anchor="end"
					dominant-baseline="middle"
					class="value"
				>
					{d.seconds.toFixed(1)}s
				</text>
			{/if}
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
		font-weight: 600;
		fill: var(--fg);
	}
	.value {
		font-size: 11px;
		font-weight: 700;
		fill: white;
		font-variant-numeric: tabular-nums;
	}
</style>
