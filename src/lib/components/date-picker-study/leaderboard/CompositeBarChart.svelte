<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';

	import type { PickerLeaderboardRow } from '$lib/utils/leaderboard-aggregation';

	import CompositeChartBody from './CompositeChartBody.svelte';

	let {
		rows,
		pickerColor
	}: { rows: PickerLeaderboardRow[]; pickerColor: Record<string, string> } = $props();

	const sorted = $derived([...rows].sort((a, b) => b.composite_score - a.composite_score));
</script>

<div class="chart">
	<LayerCake
		padding={{ top: 12, right: 64, bottom: 32, left: 96 }}
		x="composite_score"
		y="picker_label"
		yScale={scaleBand().paddingInner(0.3)}
		xDomain={[0, 15]}
		data={sorted}
	>
		<Svg>
			<CompositeChartBody {pickerColor} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart {
		width: 100%;
		height: 240px;
	}
</style>
