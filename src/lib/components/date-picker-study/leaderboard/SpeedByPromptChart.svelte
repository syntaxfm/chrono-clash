<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';

	import type { PromptTimingRow } from '$lib/utils/leaderboard-aggregation';

	import SpeedByPromptChartBody from './SpeedByPromptChartBody.svelte';

	let {
		rows,
		pickerColor
	}: { rows: PromptTimingRow[]; pickerColor: Record<string, string> } = $props();

	type FlatPoint = {
		prompt: string;
		category: string;
		picker_id: string;
		picker_label: string;
		seconds: number;
		run_count: number;
	};

	const flat = $derived<FlatPoint[]>(
		rows.flatMap((row) =>
			row.pickers.map((p) => ({
				prompt: row.prompt_text,
				category: row.challenge_group_label,
				picker_id: p.picker_id,
				picker_label: p.picker_label,
				seconds: p.mean_ms / 1000,
				run_count: p.run_count
			}))
		)
	);

	const pickerIds = $derived(rows[0]?.pickers.map((p) => p.picker_id) ?? []);
	const promptOrder = $derived(rows.map((r) => r.prompt_text));
	const maxSeconds = $derived(Math.max(1, ...flat.map((d) => d.seconds)) * 1.15);
	const chartHeight = $derived(Math.max(200, rows.length * 64));
</script>

<div class="chart" style:height="{chartHeight}px">
	<LayerCake
		padding={{ top: 12, right: 56, bottom: 32, left: 240 }}
		x="seconds"
		y="prompt"
		yScale={scaleBand().domain(promptOrder).paddingInner(0.25).paddingOuter(0.1)}
		xDomain={[0, maxSeconds]}
		data={flat}
	>
		<Svg>
			<SpeedByPromptChartBody {pickerIds} {pickerColor} {maxSeconds} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart {
		width: 100%;
	}
</style>
