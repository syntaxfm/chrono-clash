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
	<h1>Session</h1>
	<a href={resolve('/admin')}>Back</a>
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
		<h2>Overview</h2>
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
		<h2>Participant link</h2>
		<input readonly value={participantUrl} aria-label="Participant URL" />
		<button type="button" onclick={copyUrl}>
			{copyState === 'copied' ? 'Copied' : 'Copy'}
		</button>
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
