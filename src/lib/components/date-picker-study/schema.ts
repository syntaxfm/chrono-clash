import type { ResolveQuery } from 'jazz-tools';
import { co, z } from 'jazz-tools';

// Schema version stamped on every CoMap at creation. Jazz's CoMap migration
// guidance is explicit: never rename or change types of published fields, only
// add new optional ones, and use a version field so readers can branch on
// shape when a non-compatible change is eventually forced. Default it here so
// existing records without the field still load as version 1.
const STUDY_SCHEMA_VERSION = 1;

// Canonical date key shape used everywhere dates are stored or compared.
// Correctness (spec §7) is strict string equality on this format, so pinning
// the regex at the schema boundary guarantees the check never has to
// normalize at read-time and picker adapters must emit this exact shape.
export const PLAIN_DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Accepts either a single plain date key (YYYY-MM-DD) OR a range expressed
// as two plain date keys joined by a slash (YYYY-MM-DD/YYYY-MM-DD). Range
// challenges and single-date challenges share the same string field — the
// presence of "/" is the discriminator, so no schema shape change is needed
// to support both. Picker adapters for range-capable inputs must emit the
// range form; single-date adapters keep emitting plain keys.
export const STUDY_TARGET_VALUE_REGEX =
	/^\d{4}-\d{2}-\d{2}(?:\/\d{4}-\d{2}-\d{2})?$/;

// Session and round statuses are kept as two separate enums on purpose.
// Session-level states like 'abandoned' don't apply to a single round, and
// round-level states like 'awaiting_rating' don't apply to the whole session.
// Jazz schema guidance treats enums as append-only — keeping each enum narrow
// reduces the chance we're ever forced into a destructive rename.
export const STUDY_SESSION_STATUS_VALUES = [
	'pending_participant',
	'in_progress',
	'paused',
	'completed',
	'abandoned',
	'cancelled'
] as const;

export const STUDY_ROUND_STATUS_VALUES = [
	'pending',
	'in_progress',
	'paused',
	'awaiting_rating',
	'completed',
	'cancelled'
] as const;

export const StudySessionStatusSchema = z.enum(STUDY_SESSION_STATUS_VALUES);
export const StudyRoundStatusSchema = z.enum(STUDY_ROUND_STATUS_VALUES);

// 1–5 integer scale for the three rubric dimensions. Smallest scale that still
// yields usable means/medians at low N; wider scales add noise without
// discrimination. Int-only prevents fractional values from sneaking in via
// sliders or typed inputs.
const ratingValueSchema = z.number().int().min(1).max(5);

// One participant's execution record for a single challenge.
//
// Timing fields are epoch-ms integers (not Date or ISO strings): they sort
// correctly without timezone parsing, subtract directly for elapsed_ms, and
// survive Jazz serialization with no custom hooks. Timezone for display lives
// on StudySession separately — compute stays in ms.
//
// shown_at_ms / completed_at_ms / elapsed_ms are optional because a run is
// created in 'pending' state before the participant sees it. elapsed_ms is
// stored in addition to the two endpoints so exports and dashboards can
// aggregate without re-reading both timestamps.
//
// Counter defaults of 0 prevent `undefined + 1 === NaN` footguns when the
// instrumentation layer increments during a challenge (reset per challenge
// start per spec §8.5).
export const StudyChallengeRun = co.map({
	schema_version: z.number().int().default(STUDY_SCHEMA_VERSION),
	run_index: z.number().int().nonnegative(),
	challenge_group_id: z.string(),
	prompt_text: z.string(),
	target_date_iso: z.string().regex(STUDY_TARGET_VALUE_REGEX),

	shown_at_ms: z.number().int().nonnegative().optional(),
	completed_at_ms: z.number().int().nonnegative().optional(),
	elapsed_ms: z.number().int().nonnegative().optional(),

	attempt_count: z.number().int().nonnegative().default(0),
	click_count: z.number().int().nonnegative().default(0),
	keypress_count: z.number().int().nonnegative().default(0),

	final_value_iso: z.string().regex(STUDY_TARGET_VALUE_REGEX).optional(),
	is_correct: z.boolean().default(false)
});

// One participant's run through a single picker, inside a session.
//
// picker_id is the stable grouping key used for analysis and metrics; it must
// never change after creation. picker_label is presentation ("Input A/B/C")
// and is free to vary per cohort without invalidating history — kept separate
// on purpose.
//
// current_challenge_index lives at the round level (not the session) so a
// round's progress is self-contained and resume (reload) can restore exact
// position without cross-round coupling.
//
// Ratings are three parallel optional fields rather than a nested CoMap: the
// rubric is fixed, so inlining keeps resolve queries flat, and optional
// matches the "auto-submit when all three are set" flow — partial state is
// valid while the user is still deciding.
//
// total_elapsed_ms / average_elapsed_ms are persisted (not just derivable)
// so admin dashboards get single-field reads without walking runs[].
//
// runs is a co.list (ordered) rather than a co.record (keyed): presentation
// order IS the data here — counterbalancing and learning-curve analysis
// depend on run_index, and co.list preserves insertion order natively.
export const StudyInputRound = co.map({
	schema_version: z.number().int().default(STUDY_SCHEMA_VERSION),
	round_index: z.number().int().nonnegative(),
	picker_id: z.string(),
	picker_label: z.string(),

	status: StudyRoundStatusSchema.default('pending'),
	current_challenge_index: z.number().int().nonnegative().default(0),

	started_at_ms: z.number().int().nonnegative().optional(),
	ended_at_ms: z.number().int().nonnegative().optional(),
	total_elapsed_ms: z.number().int().nonnegative().optional(),
	average_elapsed_ms: z.number().int().nonnegative().optional(),

	rating_design: ratingValueSchema.optional(),
	rating_ease_of_use: ratingValueSchema.optional(),
	rating_magicalness: ratingValueSchema.optional(),

	runs: co.list(StudyChallengeRun)
});

// One complete participant run across all three pickers.
//
// Participant identity (participant_id, participant_first_name) is optional
// because admin creates the session BEFORE the participant lands — these are
// literally unknown at creation time and are written on Start. Keeping them
// optional matches the pending_participant → in_progress transition without
// a migration.
//
// timezone / locale are captured once per session. Needed for correct display
// of dates to the participant, but correctness arithmetic stays in ms-since-
// epoch. Capturing once avoids drift if the device locale changes mid-session.
//
// current_round_index + StudyInputRound.current_challenge_index together
// uniquely place the participant on reload, which is what enables
// deep-link-less resume (spec §5).
export const StudySession = co.map({
	schema_version: z.number().int().default(STUDY_SCHEMA_VERSION),
	created_by_account_id: z.string(),
	created_at_ms: z.number().int().nonnegative(),

	// Zero-based position in StudySessionIndex.sessions at creation time.
	// Persisted (not recomputed from list position) so counterbalancing via
	// `session_index % 6` stays stable if sessions are later reordered or
	// deleted. Optional per spec §3.2 — additive shape keeps the door open for
	// future migration of records that predate the field.
	session_index: z.number().int().nonnegative().optional(),

	participant_id: z.string().optional(),
	participant_first_name: z.string().optional(),

	started_at_ms: z.number().int().nonnegative().optional(),
	ended_at_ms: z.number().int().nonnegative().optional(),
	status: StudySessionStatusSchema.default('pending_participant'),

	timezone: z.string().optional(),
	locale: z.string().optional(),

	current_round_index: z.number().int().nonnegative().default(0),
	rounds: co.list(StudyInputRound)
});

// Top-level container that holds every session any admin has created. Owned
// by the shared admin group (spec §6.2): every admin human is a writer member
// and participants read session data via the group's public-readable
// permission — there is no per-admin index. Referenced from
// RateDateAccountRoot.study_session_index on every admin root, so all admin
// roots point at the same CoValue. co.list preserves insertion order so
// newest-first display in admin is just a toReversed() away.
export const StudySessionIndex = co.map({
	schema_version: z.number().int().default(STUDY_SCHEMA_VERSION),
	sessions: co.list(StudySession)
});

// Deep-load query for a full session. Jazz's deep-loading contract requires
// every nested CoValue the UI will read to appear in the resolve query;
// otherwise the reference is null at access time. The participant/admin UI
// walks session → active round → active run on every render, so both $each
// levels are required. `as const satisfies ResolveQuery<…>` pins the shape
// so TypeScript gives precise types for the resolved session downstream.
export const STUDY_SESSION_RESOLVE = {
	rounds: {
		$each: {
			runs: {
				$each: true
			}
		}
	}
} as const satisfies ResolveQuery<typeof StudySession>;

// Index-level resolve: load all sessions AND their rounds/runs eagerly so the
// admin dashboard can render a list with per-session progress without a
// second round-trip.
export const STUDY_SESSION_INDEX_RESOLVE = {
	sessions: {
		$each: STUDY_SESSION_RESOLVE
	}
} as const satisfies ResolveQuery<typeof StudySessionIndex>;

export type StudySessionStatus = z.infer<typeof StudySessionStatusSchema>;
export type StudyRoundStatus = z.infer<typeof StudyRoundStatusSchema>;
