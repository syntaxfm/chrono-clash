<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';

	import {
		RATING_DIMENSIONS,
		RATING_DIMENSION_LABEL,
		getRatingForDimension,
		type PickerLeaderboardRow,
		type RatingDimension
	} from '$lib/utils/leaderboard-aggregation';

	import RatingsChartBody from './RatingsChartBody.svelte';

	let {
		rows,
		pickerColor,
		dimension
	}: {
		rows: PickerLeaderboardRow[];
		pickerColor: Record<string, string>;
		dimension?: RatingDimension;
	} = $props();

	type FlatPoint = {
		dimension: string;
		picker_id: string;
		picker_label: string;
		value: number;
	};

	const dims = $derived<readonly RatingDimension[]>(
		dimension ? [dimension] : RATING_DIMENSIONS
	);

	const flat = $derived<FlatPoint[]>(
		dims.flatMap((dim) =>
			rows.map((r) => ({
				dimension: RATING_DIMENSION_LABEL[dim],
				picker_id: r.picker_id,
				picker_label: r.picker_label,
				value: getRatingForDimension(r, dim)
			}))
		)
	);

	const pickerIds = $derived(rows.map((r) => r.picker_id));
</script>

<div class="chart">
	<LayerCake
		padding={{ top: 16, right: 16, bottom: 44, left: 36 }}
		x="dimension"
		y="value"
		xScale={scaleBand().paddingInner(0.25).paddingOuter(0.1)}
		yDomain={[0, 5]}
		data={flat}
	>
		<Svg>
			<RatingsChartBody {pickerIds} {pickerColor} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart {
		width: 100%;
		height: 320px;
	}
</style>
