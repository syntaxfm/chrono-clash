<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';

	import type { PickerLeaderboardRow } from '$lib/utils/leaderboard-aggregation';

	import SpeedChartBody from './SpeedChartBody.svelte';

	let {
		rows,
		pickerColor
	}: { rows: PickerLeaderboardRow[]; pickerColor: Record<string, string> } = $props();

	type SpeedRow = {
		picker_id: string;
		picker_label: string;
		mean_seconds: number;
	};

	const sorted = $derived<SpeedRow[]>(
		rows
			.filter((r) => r.mean_elapsed_ms > 0)
			.map((r) => ({
				picker_id: r.picker_id,
				picker_label: r.picker_label,
				mean_seconds: r.mean_elapsed_ms / 1000
			}))
			.sort((a, b) => a.mean_seconds - b.mean_seconds)
	);

	const maxSeconds = $derived(Math.max(1, ...sorted.map((r) => r.mean_seconds)) * 1.12);
</script>

<div class="chart">
	<LayerCake
		padding={{ top: 12, right: 72, bottom: 32, left: 104 }}
		x="mean_seconds"
		y="picker_label"
		yScale={scaleBand().paddingInner(0.3)}
		xDomain={[0, maxSeconds]}
		data={sorted}
	>
		<Svg>
			<SpeedChartBody {pickerColor} {maxSeconds} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart {
		width: 100%;
		height: 240px;
	}
</style>
