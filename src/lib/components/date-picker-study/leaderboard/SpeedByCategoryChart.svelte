<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';

	import type { CategoryTimingRow } from '$lib/utils/leaderboard-aggregation';

	import SpeedByCategoryChartBody from './SpeedByCategoryChartBody.svelte';

	let {
		rows,
		pickerColor
	}: { rows: CategoryTimingRow[]; pickerColor: Record<string, string> } = $props();

	type FlatPoint = {
		category: string;
		picker_id: string;
		picker_label: string;
		seconds: number;
		run_count: number;
	};

	const flat = $derived<FlatPoint[]>(
		rows.flatMap((row) =>
			row.pickers.map((p) => ({
				category: row.challenge_group_label,
				picker_id: p.picker_id,
				picker_label: p.picker_label,
				seconds: p.mean_ms / 1000,
				run_count: p.run_count
			}))
		)
	);

	const pickerIds = $derived(rows[0]?.pickers.map((p) => p.picker_id) ?? []);

	const maxSeconds = $derived(Math.max(1, ...flat.map((d) => d.seconds)) * 1.15);
</script>

<div class="chart">
	<LayerCake
		padding={{ top: 16, right: 16, bottom: 52, left: 44 }}
		x="category"
		y="seconds"
		xScale={scaleBand().paddingInner(0.25).paddingOuter(0.1)}
		yDomain={[0, maxSeconds]}
		data={flat}
	>
		<Svg>
			<SpeedByCategoryChartBody {pickerIds} {pickerColor} {maxSeconds} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart {
		width: 100%;
		height: 340px;
	}
</style>
