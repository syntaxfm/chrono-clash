import * as Sentry from '@sentry/sveltekit';

import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';

// Sentry metric attribute shape: string/number/boolean only (spec §8 + Sentry
// SDK). We build attribute objects piecemeal and drop undefined entries so
// the final payload is fully typed and has no noise keys.
type MetricAttributes = Record<string, string | number | boolean>;

type LoadedRound = LoadedParticipantSession['rounds'][number];
type LoadedRun = NonNullable<LoadedRound>['runs'][number];

export type RatingDimension = 'design' | 'ease_of_use' | 'magicalness';

// Shared attribute set for every study metric (spec §8.3). Centralized so
// a new required attribute lands in one place. Intentionally excludes
// participant_first_name and prompt_text — those are explicit privacy /
// cardinality violations per spec §8.4.
function baseAttributes(session: LoadedParticipantSession, roundIndex: number): MetricAttributes {
	const round = session.rounds[roundIndex];
	if (!round) {
		throw new Error(`metrics: round ${roundIndex} missing on session ${session.$jazz.id}`);
	}
	const attrs: MetricAttributes = {
		session_id: session.$jazz.id,
		picker_id: round.picker_id,
		input_round_index: roundIndex,
		device_class: detectDeviceClass()
	};
	if (session.participant_id !== undefined) attrs.participant_id = session.participant_id;
	if (session.timezone !== undefined) attrs.timezone = session.timezone;
	if (session.locale !== undefined) attrs.locale = session.locale;
	return attrs;
}

// User-agent sniff is the pragmatic device_class signal (spec §8.3). Coarse
// on purpose — we only care about desktop vs mobile buckets for analysis,
// not exact device models. Falls back to 'desktop' during SSR where
// navigator is undefined.
function detectDeviceClass(): 'desktop' | 'mobile' {
	if (typeof navigator === 'undefined') return 'desktop';
	return /mobi/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

// Fire every challenge-level metric in one call (spec §8.2 rows for
// study.challenge.*). Called from the runner right after a correct emission
// so the CoValue fields used as values are already set. Emitting together
// keeps the "one challenge resolution = one batch of metrics" invariant the
// analysis assumes.
export function emitChallengeResolved(
	session: LoadedParticipantSession,
	roundIndex: number,
	run: NonNullable<LoadedRun>
): void {
	const attrs: MetricAttributes = {
		...baseAttributes(session, roundIndex),
		challenge_id: run.challenge_group_id,
		challenge_index: run.run_index
	};

	Sentry.metrics.count('study.challenge.completed', 1, { attributes: attrs });
	if (run.elapsed_ms !== undefined) {
		Sentry.metrics.distribution('study.challenge.duration_ms', run.elapsed_ms, {
			unit: 'millisecond',
			attributes: attrs
		});
	}
	Sentry.metrics.distribution('study.challenge.attempt_count', run.attempt_count, {
		attributes: attrs
	});
	Sentry.metrics.distribution('study.challenge.click_count', run.click_count, {
		attributes: attrs
	});
	Sentry.metrics.distribution('study.challenge.keypress_count', run.keypress_count, {
		attributes: attrs
	});
}

// Fire round-completion metrics + one rating distribution per dimension
// (spec §8.2 rows for study.input_round.*). Called from the rating form
// right after completeRoundAfterRating so total_elapsed_ms is already
// stamped and the three rating_* fields are present — the NonNullable
// asserts below are safe because submit is gated on all three being set.
export function emitRoundCompleted(
	session: LoadedParticipantSession,
	roundIndex: number,
	round: NonNullable<LoadedRound>
): void {
	const baseAttrs = baseAttributes(session, roundIndex);

	Sentry.metrics.count('study.input_round.completed', 1, { attributes: baseAttrs });
	if (round.total_elapsed_ms !== undefined) {
		Sentry.metrics.distribution('study.input_round.total_duration_ms', round.total_elapsed_ms, {
			unit: 'millisecond',
			attributes: baseAttrs
		});
	}

	// Three separate emissions keyed by `dimension` (spec §8.3) so rating
	// analysis can split by rubric without parsing a single compound metric.
	emitRatingDimension(baseAttrs, 'design', round.rating_design);
	emitRatingDimension(baseAttrs, 'ease_of_use', round.rating_ease_of_use);
	emitRatingDimension(baseAttrs, 'magicalness', round.rating_magicalness);
}

function emitRatingDimension(
	baseAttrs: MetricAttributes,
	dimension: RatingDimension,
	value: number | undefined
): void {
	if (value === undefined) return;
	Sentry.metrics.distribution('study.input_round.rating', value, {
		attributes: { ...baseAttrs, dimension }
	});
}

// Hard completion flush (spec §8.1). Metrics are buffered in memory; a
// participant hitting the completion screen is the last write we'll see,
// so we force-flush to make sure the final batch lands in Sentry before
// the tab idles. 2s timeout matches Sentry's default flush budget; the
// promise is intentionally not awaited by callers since the UI can move
// on while the flush completes.
export async function flushStudyMetrics(): Promise<void> {
	try {
		await Sentry.flush(2000);
	} catch {
		// Best-effort: if the flush fails we don't want to break the UI.
	}
}
