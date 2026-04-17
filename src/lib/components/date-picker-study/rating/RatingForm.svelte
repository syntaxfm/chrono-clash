<script lang="ts">
	import { completeRoundAfterRating } from '$lib/components/date-picker-study/engine/progression';
	import {
		emitRoundCompleted,
		flushStudyMetrics
	} from '$lib/components/date-picker-study/metrics/emit';
	import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';
	import StarRating from '$lib/components/date-picker-study/rating/StarRating.svelte';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();

	const round = $derived(session.rounds[session.current_round_index]);

	// Unique name scope per round so radio groups don't bleed across re-renders
	// or the "next round" case where the same DOM slot mounts a different
	// round after the previous one is submitted.
	const nameScope = $derived(round ? round.$jazz.id : 'rating');

	// Submit is the explicit round-completion action. Enabled only when all
	// three ratings are set; submitting stamps the timestamp and hands off
	// to the engine to advance the round or finalize the session.
	const allSet = $derived(
		round?.rating_design !== undefined &&
			round?.rating_ease_of_use !== undefined &&
			round?.rating_magicalness !== undefined
	);

	type RatingField = 'rating_design' | 'rating_ease_of_use' | 'rating_magicalness';

	// Star selections persist to Jazz immediately so partial state survives
	// reload/resume. Round advancement is gated on submit (see below), not
	// on completing the trio.
	function setRating(field: RatingField, nextValue: number): void {
		if (!round) return;
		round.$jazz.set(field, nextValue);
	}

	// Submit is idempotent on re-click because completeRoundAfterRating
	// guards on round.status — once the first submit flips it off
	// awaiting_rating, subsequent calls no-op.
	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!round || !allSet) return;

		// Pin the round ref + index BEFORE the engine advances current_round_index.
		// completeRoundAfterRating closes this round and may flip session.status
		// to 'completed' when it was the last one; the metric has to describe
		// the round that was just completed, not whatever comes next.
		const completedRound = round;
		const completedRoundIndex = session.current_round_index;

		completeRoundAfterRating(session, Date.now());
		emitRoundCompleted(session, completedRoundIndex, completedRound);

		// Spec §8.1: flush metrics on hard completion. Participants are on
		// their way to closing the tab; without a flush, the buffered batch
		// never makes it to Sentry.
		if (session.status === 'completed') {
			void flushStudyMetrics();
		}
	}
</script>

{#if round}
	<form onsubmit={submit}>
		<StarRating
			name="{nameScope}-design"
			legend="Design"
			value={round.rating_design}
			onchange={(v) => setRating('rating_design', v)}
		/>
		<StarRating
			name="{nameScope}-ease"
			legend="Ease of use"
			value={round.rating_ease_of_use}
			onchange={(v) => setRating('rating_ease_of_use', v)}
		/>
		<StarRating
			name="{nameScope}-magical"
			legend="Joy"
			value={round.rating_magicalness}
			onchange={(v) => setRating('rating_magicalness', v)}
		/>
		<button class="big-boi primary" type="submit" disabled={!allSet}>Submit</button>
	</form>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		button {
			margin-top: 2rem;
		}
	}
</style>
