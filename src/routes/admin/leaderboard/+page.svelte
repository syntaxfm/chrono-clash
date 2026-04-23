<script lang="ts">
	import { resolve } from '$app/paths';
	import { AccountCoState } from 'jazz-tools/svelte';

	import CompositeBarChart from '$lib/components/date-picker-study/leaderboard/CompositeBarChart.svelte';
	import { PICKER_COLOR } from '$lib/components/date-picker-study/leaderboard/picker-colors';
	import RatingsBarChart from '$lib/components/date-picker-study/leaderboard/RatingsBarChart.svelte';
	import SpeedBarChart from '$lib/components/date-picker-study/leaderboard/SpeedBarChart.svelte';
	import SpeedByCategoryChart from '$lib/components/date-picker-study/leaderboard/SpeedByCategoryChart.svelte';
	import SpeedByPromptChart from '$lib/components/date-picker-study/leaderboard/SpeedByPromptChart.svelte';
	import { RATE_DATE_ACCOUNT_RESOLVE, RateDateAccount } from '$lib/schema';
	import {
		aggregatePickerLeaderboard,
		aggregateSpeedByCategory,
		aggregateSpeedByPrompt,
		computeOutlierBoundsByPicker,
		RATING_DIMENSIONS,
		RATING_DIMENSION_LABEL
	} from '$lib/utils/leaderboard-aggregation';

	const me = new AccountCoState(RateDateAccount, { resolve: RATE_DATE_ACCOUNT_RESOLVE });

	let excludeOutliers = $state(false);

	let revealed = $state<{
		rating: Record<string, boolean>;
		speed: boolean;
		speedCategory: boolean;
		speedPrompt: boolean;
		composite: boolean;
	}>({
		rating: {},
		speed: false,
		speedCategory: false,
		speedPrompt: false,
		composite: false
	});

	const outlierBounds = $derived.by(() => {
		if (!excludeOutliers) return undefined;
		const cur = me.current;
		if (!cur?.$isLoaded) return undefined;
		return computeOutlierBoundsByPicker(cur.root.study_session_index.sessions);
	});

	const rows = $derived.by(() => {
		const cur = me.current;
		if (!cur?.$isLoaded) return [];
		return aggregatePickerLeaderboard(cur.root.study_session_index.sessions, outlierBounds);
	});

	const speedByCategory = $derived.by(() => {
		const cur = me.current;
		if (!cur?.$isLoaded) return [];
		return aggregateSpeedByCategory(cur.root.study_session_index.sessions, outlierBounds);
	});

	const speedByPrompt = $derived.by(() => {
		const cur = me.current;
		if (!cur?.$isLoaded) return [];
		return aggregateSpeedByPrompt(cur.root.study_session_index.sessions, outlierBounds);
	});

	const ranked = $derived([...rows].sort((a, b) => b.composite_score - a.composite_score));
	const totalSessions = $derived.by(() => {
		const cur = me.current;
		if (!cur?.$isLoaded) return 0;
		return cur.root.study_session_index.sessions.length;
	});
	const totalSamples = $derived(rows.reduce((sum, r) => sum + r.sample_size, 0));

	function fmtPercent(n: number): string {
		return `${(n * 100).toFixed(0)}%`;
	}

	function fmtSeconds(ms: number): string {
		if (ms === 0) return '—';
		return `${(ms / 1000).toFixed(2)}s`;
	}
</script>

<a class="back" href={resolve('/admin')}
	><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
		><title>arrow-bold-left</title><g fill="currentColor"
			><path
				d="M15.25 5.99995H9.99997V4.00695C9.99997 3.52895 9.73397 3.09995 9.30597 2.88695C8.87897 2.67495 8.37597 2.72195 7.99497 3.01095L1.41397 8.00395C1.09997 8.24195 0.919983 8.60495 0.919983 8.99995C0.919983 9.39495 1.09997 9.75695 1.41397 9.99595L7.99497 14.9889C8.21797 15.1579 8.48196 15.2439 8.74896 15.2439C8.93696 15.2439 9.12897 15.2009 9.30597 15.1129C9.73497 14.8999 9.99997 14.4709 9.99997 13.9929V11.9999H15.25C16.215 11.9999 17 11.2149 17 10.2499V7.74995C17 6.78495 16.215 5.99995 15.25 5.99995Z"
				fill-opacity="0.4"
			></path></g
		></svg
	>Back</a
>

<h1>Leaderboard</h1>

{#if !me.current?.$isLoaded}
	<p>Loading…</p>
{:else if totalSessions === 0}
	<p>No sessions yet.</p>
{:else if totalSamples === 0}
	<p>No rounds have been completed yet.</p>
{:else}
	<dl class="summary">
		<div>
			<dt>Sessions</dt>
			<dd>{totalSessions}</dd>
		</div>
		<div>
			<dt>Rounds scored</dt>
			<dd>{totalSamples}</dd>
		</div>
	</dl>

	<label class="filter">
		<input type="checkbox" bind:checked={excludeOutliers} />
		Exclude speed outliers
	</label>

	<section>
		<h2>Rating breakdown</h2>
		<p class="hint">Mean rating per dimension across every completed round.</p>
		<div class="legend">
			{#each ranked as row (row.picker_id)}
				<span class="swatch">
					<span class="dot" style:background={PICKER_COLOR[row.picker_id]}></span>
					{row.picker_label}
				</span>
			{/each}
		</div>
		<div class="rating-grid">
			{#each RATING_DIMENSIONS as dim (dim)}
				<div class="rating-panel">
					<h3>{RATING_DIMENSION_LABEL[dim]}</h3>
					<div class="reveal" class:revealed={revealed.rating[dim]}>
						<RatingsBarChart rows={ranked} pickerColor={PICKER_COLOR} dimension={dim} />
						{#if !revealed.rating[dim]}
							<button class="reveal-btn" onclick={() => (revealed.rating[dim] = true)}>Reveal</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2>Overall speed</h2>
		<p class="hint">Mean time per challenge — shorter is better.</p>
		<div class="reveal" class:revealed={revealed.speed}>
			<SpeedBarChart rows={ranked} pickerColor={PICKER_COLOR} />
			{#if !revealed.speed}
				<button class="reveal-btn" onclick={() => (revealed.speed = true)}>Reveal</button>
			{/if}
		</div>
	</section>

	{#if speedByCategory.length > 0}
		<section>
			<h2>Speed by category</h2>
			<p class="hint">Mean time per challenge, broken down by challenge type.</p>
			<div class="legend">
				{#each ranked as row (row.picker_id)}
					<span class="swatch">
						<span class="dot" style:background={PICKER_COLOR[row.picker_id]}></span>
						{row.picker_label}
					</span>
				{/each}
			</div>
			<div class="reveal" class:revealed={revealed.speedCategory}>
				<SpeedByCategoryChart rows={speedByCategory} pickerColor={PICKER_COLOR} />
				{#if !revealed.speedCategory}
					<button class="reveal-btn" onclick={() => (revealed.speedCategory = true)}>Reveal</button
					>
				{/if}
			</div>
		</section>
	{/if}

	{#if speedByPrompt.length > 0}
		<section>
			<h2>Speed by prompt</h2>
			<p class="hint">
				Mean time per prompt, only prompts attempted by two or more pickers. Slowest first.
			</p>
			<div class="legend">
				{#each ranked as row (row.picker_id)}
					<span class="swatch">
						<span class="dot" style:background={PICKER_COLOR[row.picker_id]}></span>
						{row.picker_label}
					</span>
				{/each}
			</div>
			<div class="reveal" class:revealed={revealed.speedPrompt}>
				<SpeedByPromptChart rows={speedByPrompt} pickerColor={PICKER_COLOR} />
				{#if !revealed.speedPrompt}
					<button class="reveal-btn" onclick={() => (revealed.speedPrompt = true)}>Reveal</button>
				{/if}
			</div>
		</section>
	{/if}

	<section>
		<h2>Composite score</h2>
		<p class="hint">Sum of design, ease of use, and magicalness means — out of 15.</p>
		<div class="reveal" class:revealed={revealed.composite}>
			<CompositeBarChart rows={ranked} pickerColor={PICKER_COLOR} />
			{#if !revealed.composite}
				<button class="reveal-btn" onclick={() => (revealed.composite = true)}>Reveal</button>
			{/if}
		</div>
	</section>

	<section>
		<h2>Details</h2>
		<div class="table">
			<table>
				<thead>
					<tr>
						<th scope="col">Rank</th>
						<th scope="col">Picker</th>
						<th scope="col">Composite</th>
						<th scope="col">Design</th>
						<th scope="col">Ease</th>
						<th scope="col">Magic</th>
						<th scope="col">Correct</th>
						<th scope="col">Avg time</th>
						<th scope="col">Rounds</th>
					</tr>
				</thead>
				<tbody>
					{#each ranked as row, i (row.picker_id)}
						<tr>
							<td>{i + 1}</td>
							<td>
								<span class="dot" style:background={PICKER_COLOR[row.picker_id]}></span>
								{row.picker_label}
							</td>
							<td>{row.composite_score.toFixed(2)}</td>
							<td>{row.rating_design_mean.toFixed(2)}</td>
							<td>{row.rating_ease_of_use_mean.toFixed(2)}</td>
							<td>{row.rating_magicalness_mean.toFixed(2)}</td>
							<td>{fmtPercent(row.correctness_rate)} ({row.runs_correct}/{row.runs_total})</td>
							<td>{fmtSeconds(row.mean_elapsed_ms)}</td>
							<td>{row.sample_size}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
{/if}

<style>
	h1 {
		margin: 0;
	}
	section {
		margin-block-start: var(--pad-xl);
	}
	h2 {
		margin-block-end: var(--pad-xs);
	}
	.hint {
		margin: 0 0 var(--pad-l);
		color: var(--gray-6, oklch(0.55 0 0));
	}
	.summary {
		display: flex;
		gap: var(--pad-xl);
		margin: var(--vs-l) 0;
		justify-content: center;
	}
	.summary div {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.summary dt {
		margin: 0;
		font-size: 0.85em;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--gray-6, oklch(0.55 0 0));
	}
	.summary dd {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--pad-l);
		margin-block-end: var(--pad-m);
		font-weight: 600;
	}
	.swatch {
		display: inline-flex;
		align-items: center;
		gap: var(--pad-s);
	}
	.dot {
		display: inline-block;
		width: 0.75em;
		height: 0.75em;
		border-radius: 999px;
	}
	.filter {
		display: inline-flex;
		align-items: center;
		gap: var(--pad-s);
		margin-block-end: var(--pad-l);
		cursor: pointer;
		user-select: none;
	}
	.rating-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--pad-l);
	}
	.rating-panel h3 {
		margin: 0 0 var(--pad-s);
		font-size: 1rem;
	}
	.reveal {
		position: relative;
	}
	.reveal > :global(*:not(.reveal-btn)) {
		filter: blur(14px);
		transition: filter 0.3s ease;
		pointer-events: none;
	}
	.reveal.revealed > :global(*:not(.reveal-btn)) {
		filter: none;
		pointer-events: auto;
	}
	.reveal-btn {
		position: absolute;
		inset: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;
		padding: var(--pad-s) var(--pad-l);
		background: var(--gray-1, oklch(0.98 0 0));
		color: var(--gray-9, oklch(0.2 0 0));
		border: 1px solid var(--gray-4, oklch(0.85 0 0));
		border-radius: 999px;
		font-weight: 600;
		cursor: pointer;
	}
</style>
