<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { CoState } from 'jazz-tools/svelte';

	import {
		countCompletedRounds,
		countCompletedRuns,
		countTotalRuns
	} from '$lib/components/date-picker-study/admin-workspace';
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
	<dl>
		<dt>Status</dt>
		<dd>{session.status}</dd>
		<dt>Participant</dt>
		<dd>
			{session.participant_first_name ?? 'Unassigned'}
			{#if session.participant_id}({session.participant_id}){/if}
		</dd>
		<dt>Rounds</dt>
		<dd>{countCompletedRounds(session)} / {session.rounds.length}</dd>
		<dt>Challenges</dt>
		<dd>{countCompletedRuns(session)} / {countTotalRuns(session)}</dd>
	</dl>

	<section>
		<h2>Participant link</h2>
		<input readonly value={participantUrl} aria-label="Participant URL" />
		<button type="button" onclick={copyUrl}>
			{copyState === 'copied' ? 'Copied' : 'Copy'}
		</button>
	</section>

	<ol>
		{#each session.rounds as round, index (round?.$jazz.id ?? index)}
			{#if round}
				{@const correct = round.runs.filter((run) => run?.is_correct).length}
				<li>
					<h3>Round {index + 1} — {round.picker_label}</h3>
					<p>Status: {round.status}</p>
					<p>{correct} / {round.runs.length} challenges correct</p>
				</li>
			{/if}
		{/each}
	</ol>
{/if}
