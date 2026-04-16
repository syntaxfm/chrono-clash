<script lang="ts">
	import { page } from '$app/state';
	import { CoState } from 'jazz-tools/svelte';

	import ChallengeRunner from '$lib/components/date-picker-study/challenge-runner/ChallengeRunner.svelte';
	import CompletionScreen from '$lib/components/date-picker-study/participant/CompletionScreen.svelte';
	import IdentityForm from '$lib/components/date-picker-study/participant/IdentityForm.svelte';
	import RatingView from '$lib/components/date-picker-study/participant/RatingView.svelte';
	import { STUDY_SESSION_RESOLVE, StudySession } from '$lib/components/date-picker-study/schema';

	const sessionId = $derived(page.params.sessionId ?? '');

	const sessionState = new CoState(StudySession, () => sessionId, {
		resolve: STUDY_SESSION_RESOLVE
	});
</script>

{#if sessionState.current?.$jazz.loadingState === 'loading' || !sessionState.current}
	<p>Loading…</p>
{:else if sessionState.current.$jazz.loadingState === 'unavailable'}
	<p role="alert">Session not found.</p>
{:else if sessionState.current.$jazz.loadingState === 'unauthorized'}
	<p role="alert">Not authorized to view this session.</p>
{:else if sessionState.current.$isLoaded}
	{@const session = sessionState.current}
	{#if session.status === 'pending_participant'}
		<IdentityForm {session} />
	{:else if session.status === 'in_progress'}
		{@const round = session.rounds[session.current_round_index]}
		{#if round?.status === 'awaiting_rating'}
			<RatingView {session} />
		{:else}
			<ChallengeRunner {session} />
		{/if}
	{:else if session.status === 'completed'}
		<CompletionScreen {session} />
	{:else if session.status === 'paused'}
		<p>Session paused.</p>
	{:else if session.status === 'abandoned'}
		<p role="alert">Session abandoned.</p>
	{:else if session.status === 'cancelled'}
		<p role="alert">Session cancelled.</p>
	{/if}
{/if}
