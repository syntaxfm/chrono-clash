<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { CoState } from 'jazz-tools/svelte';

	import { STUDY_SESSION_RESOLVE, StudySession } from '$lib/components/date-picker-study/schema';

	const sessionId = $derived(page.params.sessionId ?? '');

	const sessionState = new CoState(StudySession, () => sessionId, {
		resolve: STUDY_SESSION_RESOLVE
	});

	let copyState = $state<'idle' | 'copied'>('idle');
	let copyResetId: ReturnType<typeof setTimeout> | null = null;

	const participantPath = $derived(resolve('/session/[sessionId]', { sessionId }));
	const participantUrl = $derived.by(() => {
		if (typeof window === 'undefined') return '';
		return new URL(participantPath, window.location.origin).toString();
	});

	async function copyUrl() {
		if (!participantUrl) return;
		await navigator.clipboard.writeText(participantUrl);
		copyState = 'copied';
		if (copyResetId) clearTimeout(copyResetId);
		copyResetId = setTimeout(() => {
			copyState = 'idle';
		}, 1500);
	}

	function fmtTime(ms: number | undefined): string {
		if (ms === undefined) return '—';
		return new Date(ms).toLocaleString();
	}

	function fmtMs(ms: number | undefined): string {
		if (ms === undefined) return '—';
		return `${(ms / 1000).toFixed(2)}s`;
	}

	function fmtRating(value: number | undefined): string {
		return value === undefined ? '—' : `${value} / 5`;
	}
</script>

<header>
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
</header>

{#if sessionState.current?.$jazz.loadingState === 'loading' || !sessionState.current}
	<p>Loading session…</p>
{:else if sessionState.current.$jazz.loadingState === 'unavailable'}
	<p role="alert">Session not found.</p>
{:else if sessionState.current.$jazz.loadingState === 'unauthorized'}
	<p role="alert">Not authorized to view this session.</p>
{:else if sessionState.current.$isLoaded}
	{@const session = sessionState.current}

	<section>
		<h2>Participant link</h2>
		<div class="input-group">
			<input readonly value={participantUrl} aria-label="Participant URL" />
			<button type="button" onclick={copyUrl}> Copy </button>
		</div>
	</section>

	<section>
		<h2>Session Overview</h2>
		<dl>
			<dt>Status</dt>
			<dd>{session.status}</dd>
			<dt>Session index</dt>
			<dd>{session.session_index ?? '—'}</dd>
			<dt>Participant</dt>
			<dd>
				{session.participant_first_name ?? 'Unassigned'}
				{#if session.participant_id}({session.participant_id}){/if}
			</dd>
			<dt>Timezone</dt>
			<dd>{session.timezone ?? '—'}</dd>
			<dt>Locale</dt>
			<dd>{session.locale ?? '—'}</dd>
			<dt>Created</dt>
			<dd>{fmtTime(session.created_at_ms)}</dd>
			<dt>Started</dt>
			<dd>{fmtTime(session.started_at_ms)}</dd>
			<dt>Ended</dt>
			<dd>{fmtTime(session.ended_at_ms)}</dd>
		</dl>
	</section>

	<section>
		<h2>Rounds</h2>
		<ol>
			{#each session.rounds as round, roundIndex (round?.$jazz.id ?? roundIndex)}
				{#if round}
					<li>
						<h3>Round {roundIndex + 1} — {round.picker_label} ({round.picker_id})</h3>
						<dl>
							<dt>Status</dt>
							<dd>{round.status}</dd>
							<dt>Started</dt>
							<dd>{fmtTime(round.started_at_ms)}</dd>
							<dt>Ended</dt>
							<dd>{fmtTime(round.ended_at_ms)}</dd>
							<dt>Total time</dt>
							<dd>{fmtMs(round.total_elapsed_ms)}</dd>
							<dt>Average per challenge</dt>
							<dd>{fmtMs(round.average_elapsed_ms)}</dd>
							<dt>Design</dt>
							<dd>{fmtRating(round.rating_design)}</dd>
							<dt>Ease of use</dt>
							<dd>{fmtRating(round.rating_ease_of_use)}</dd>
							<dt>Magicalness</dt>
							<dd>{fmtRating(round.rating_magicalness)}</dd>
						</dl>

						<h4>Challenges</h4>
						<table>
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Prompt</th>
									<th scope="col">Group</th>
									<th scope="col">Target</th>
									<th scope="col">Final</th>
									<th scope="col">Correct</th>
									<th scope="col">Time</th>
									<th scope="col">Attempts</th>
									<th scope="col">Clicks</th>
									<th scope="col">Keys</th>
								</tr>
							</thead>
							<tbody>
								{#each round.runs as run, runIndex (run?.$jazz.id ?? runIndex)}
									{#if run}
										<tr>
											<td>{run.run_index + 1}</td>
											<td>{run.prompt_text}</td>
											<td>{run.challenge_group_id}</td>
											<td>{run.target_date_iso}</td>
											<td>{run.final_value_iso ?? '—'}</td>
											<td>{run.is_correct ? 'yes' : 'no'}</td>
											<td>{fmtMs(run.elapsed_ms)}</td>
											<td>{run.attempt_count}</td>
											<td>{run.click_count}</td>
											<td>{run.keypress_count}</td>
										</tr>
									{/if}
								{/each}
							</tbody>
						</table>
					</li>
				{/if}
			{/each}
		</ol>
	</section>
{/if}
