import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';

// Short confirmation dwell between "you got it right" and auto-advance to the
// next challenge (spec §9: "Auto-advance after success (short delay for
// confirmation)"). Tuned to register the success state without feeling slow.
// Exported so the runner can use it directly and tests can read the same
// constant rather than copy the number.
export const CHALLENGE_CONFIRMATION_DELAY_MS = 800;

type LoadedRound = LoadedParticipantSession['rounds'][number];
type LoadedRun = NonNullable<LoadedRound>['runs'][number];

// Flip a round from pending → in_progress and stamp its start timestamp.
// No-op on any other status so the UI can call this idempotently on every
// render without clobbering started_at_ms or re-firing metrics later on.
export function startRoundIfPending(round: NonNullable<LoadedRound>, nowMs: number): void {
	if (round.status !== 'pending') return;
	round.$jazz.set('status', 'in_progress');
	round.$jazz.set('started_at_ms', nowMs);
}

// Stamp shown_at_ms + reset interaction counters the first time a run is
// rendered. Guarded on `shown_at_ms === undefined` so reload/resume
// preserves accrued counts (counts persist across reloads per spec §5 —
// only a fresh run gets zeroed).
export function markRunShown(run: NonNullable<LoadedRun>, nowMs: number): void {
	if (run.shown_at_ms !== undefined) return;
	run.$jazz.set('shown_at_ms', nowMs);
	run.$jazz.set('attempt_count', 0);
	run.$jazz.set('click_count', 0);
	run.$jazz.set('keypress_count', 0);
}

// Record a correct emission: final value, timing, is_correct. Leaves round
// advancement to advanceAfterCorrectChallenge so the runner can insert a
// confirmation delay between correctness and the next challenge rendering.
export function completeRun(
	run: NonNullable<LoadedRun>,
	normalizedValue: string,
	nowMs: number
): void {
	run.$jazz.set('final_value_iso', normalizedValue);
	run.$jazz.set('completed_at_ms', nowMs);
	run.$jazz.set('elapsed_ms', nowMs - (run.shown_at_ms ?? nowMs));
	run.$jazz.set('is_correct', true);
}

// After a correct challenge completes (and the confirmation dwell elapsed),
// either move to the next challenge in the current round, or — if this was
// the last challenge — close the round out and flip it to awaiting_rating
// so the state machine routes to the rating view.
//
// Totals are written at round close (not on every challenge) so the fields
// stay derivable from the runs list but don't require walking runs[] on
// every admin dashboard read (spec §6.3 persists them for that reason).
export function advanceAfterCorrectChallenge(
	session: LoadedParticipantSession,
	nowMs: number
): void {
	const round = session.rounds[session.current_round_index];
	if (!round) return;

	const nextChallengeIndex = round.current_challenge_index + 1;
	if (nextChallengeIndex < round.runs.length) {
		round.$jazz.set('current_challenge_index', nextChallengeIndex);
		return;
	}

	closeRoundToAwaitingRating(round, nowMs);
}

function closeRoundToAwaitingRating(round: NonNullable<LoadedRound>, nowMs: number): void {
	let totalElapsed = 0;
	let completedCount = 0;
	for (const run of round.runs) {
		if (!run || run.elapsed_ms === undefined) continue;
		totalElapsed += run.elapsed_ms;
		completedCount += 1;
	}
	round.$jazz.set('ended_at_ms', nowMs);
	round.$jazz.set('total_elapsed_ms', totalElapsed);
	if (completedCount > 0) {
		round.$jazz.set('average_elapsed_ms', Math.round(totalElapsed / completedCount));
	}
	round.$jazz.set('status', 'awaiting_rating');
}

// Entry point for the rating form (jd1z5xv7): once all three rubric values
// are set and submitted, flip the round to completed and either advance to
// the next round or, if it was the last round, flip the session to
// completed. Living in the engine so the round/session lifecycle is one
// place, not split between the engine and the rating form.
export function completeRoundAfterRating(session: LoadedParticipantSession, nowMs: number): void {
	const round = session.rounds[session.current_round_index];
	if (!round) return;
	if (round.status !== 'awaiting_rating') return;

	round.$jazz.set('status', 'completed');

	const nextRoundIndex = session.current_round_index + 1;
	if (nextRoundIndex < session.rounds.length) {
		session.$jazz.set('current_round_index', nextRoundIndex);
		return;
	}

	session.$jazz.set('ended_at_ms', nowMs);
	session.$jazz.set('status', 'completed');
}
