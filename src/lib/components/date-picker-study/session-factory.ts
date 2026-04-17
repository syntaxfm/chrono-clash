import { co, type Account, type Group } from 'jazz-tools';

import {
	STUDY_TARGET_VALUE_REGEX,
	StudyChallengeRun,
	StudyInputRound,
	StudySession
} from '$lib/components/date-picker-study/schema';
import { STUDY_INPUT_COUNT } from '$lib/components/date-picker-study/pickers/catalog';

// Must match schema.ts. Kept in sync because the factory writes the version
// explicitly into newly-created records — relying only on the schema default
// would make future writers forget to bump it.
const STUDY_SCHEMA_VERSION = 1;

// Full 6-permutation counterbalance over the three picker slots. With only 3
// conditions, pure random assignment at low N can produce unbalanced order
// distributions (e.g. 4× ABC, 0× CBA) that confound learning/fatigue effects.
// Deterministic `sessionIndex % 6` (see getPickerOrderForSession) guarantees
// equal cells once N is a multiple of 6 and makes the balance verifiable
// after the fact.
export const STUDY_PICKER_ORDER_PERMUTATIONS = [
	[0, 1, 2],
	[0, 2, 1],
	[1, 0, 2],
	[1, 2, 0],
	[2, 0, 1],
	[2, 1, 0]
] as const;

export type StudyChallengeBlueprint = {
	challenge_group_id: string;
	prompt_text: string;
	target_date_iso: string;
};

export type StudyRoundBlueprint = {
	picker_id: string;
	picker_label: string;
	challenges: readonly StudyChallengeBlueprint[];
};

export type StudySessionBlueprint = {
	created_by_account_id: string;
	rounds: readonly StudyRoundBlueprint[];
	// Zero-based position in StudySessionIndex.sessions at creation time.
	// Caller reads `sessions.length` BEFORE calling the factory and passes it
	// here so counterbalancing stays stable if sessions are later reordered or
	// deleted (spec §3.2). Optional so tests can omit it.
	session_index?: number;
	created_at_ms?: number;
	timezone?: string;
	locale?: string;
	// Optional override for tests that need a deterministic pseudonymous ID.
	// In production the factory generates one via crypto.randomUUID().
	participant_id?: string;
};

// Single ownership option threaded through every CoValue the factory creates
// (the session, its rounds list, each round, its runs list, each run).
//
// Why one owner top-to-bottom: Jazz pre-created CoValues default to the active
// account as owner. The study requires the admin group (and, via public
// sharing on the session's group, participants) to read/write every nested
// value. Without this thread, participants would hit "unauthorized" on round
// / run reads and admin dashboards would only see their own account's data.
export type StudySessionFactoryOptions = {
	owner: Group | Account;
};

// Deterministic counterbalance assignment. Given the index of a newly-created
// session in the account's StudySessionIndex (0-based), returns the picker
// slot order for that participant. Throws on non-integer / negative input
// rather than silently coercing — a silent fallback would quietly bias the
// study. Returned as a fresh tuple to prevent callers from mutating the
// shared permutation array.
export function getPickerOrderForSession(sessionIndex: number): readonly [number, number, number] {
	if (!Number.isInteger(sessionIndex) || sessionIndex < 0) {
		throw new TypeError('sessionIndex must be a nonnegative integer');
	}

	const order =
		STUDY_PICKER_ORDER_PERMUTATIONS[sessionIndex % STUDY_PICKER_ORDER_PERMUTATIONS.length];

	return [order[0], order[1], order[2]];
}

// Build a StudySession (+ all rounds + all challenge runs) from a plain
// blueprint in one atomic factory call.
//
// Why a factory rather than step-by-step CoMap.create calls scattered through
// the admin page: the study is only meaningful if a session starts with the
// right shape (exactly 3 rounds, N challenges each, YYYY-MM-DD targets). The
// factory is the single boundary where that shape is validated — if it
// throws, nothing is written. Ad-hoc creation elsewhere would risk partial
// sessions landing in the StudySessionIndex.
//
// All validation is throw-on-bad-input with TypeError and a precise message.
// This is a pre-study authoring step (admin running it); being loud beats
// writing a broken session that corrupts later analysis.
export function createStudySession(
	blueprint: StudySessionBlueprint,
	options: StudySessionFactoryOptions
) {
	const createdByAccountId = blueprint.created_by_account_id.trim();

	if (createdByAccountId.length === 0) {
		throw new TypeError('created_by_account_id must be a non-empty string');
	}

	// Hard-pin to 3 rounds. The counterbalance table (§3.2) and the analysis
	// plan both assume exactly three pickers — a blueprint with 2 or 4 rounds
	// would silently break counterbalancing. Reject here rather than at read
	// time.
	if (blueprint.rounds.length !== STUDY_INPUT_COUNT) {
		throw new TypeError(`rounds must contain exactly ${STUDY_INPUT_COUNT} entries`);
	}

	if (
		blueprint.session_index !== undefined &&
		(!Number.isInteger(blueprint.session_index) || blueprint.session_index < 0)
	) {
		throw new TypeError('session_index must be a nonnegative integer');
	}

	const owner = options.owner;

	const rounds = blueprint.rounds.map((round, roundIndex) => {
		if (round.challenges.length === 0) {
			throw new TypeError(`round ${roundIndex} must include at least one challenge`);
		}

		if (round.picker_id.trim().length === 0) {
			throw new TypeError(`round ${roundIndex} picker_id must be a non-empty string`);
		}

		if (round.picker_label.trim().length === 0) {
			throw new TypeError(`round ${roundIndex} picker_label must be a non-empty string`);
		}

		// Pre-create every challenge run in 'pending' shape up front (no
		// shown_at_ms, no completed_at_ms). This gives the participant UI a
		// stable list of CoValue IDs to walk and lets resume-after-reload find
		// the exact run to resume without generating anything new. Runtime
		// only flips fields via $jazz.set — it never appends runs mid-session.
		const runs = round.challenges.map((challenge, runIndex) => {
			// Target value format is enforced at creation so the correctness
			// engine never has to handle malformed targets at run time. Accepts
			// single dates (YYYY-MM-DD) or ranges (YYYY-MM-DD/YYYY-MM-DD).
			if (!STUDY_TARGET_VALUE_REGEX.test(challenge.target_date_iso)) {
				throw new TypeError(
					`challenge ${runIndex} in round ${roundIndex} target_date_iso must use YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD format`
				);
			}

			return StudyChallengeRun.create(
				{
					schema_version: STUDY_SCHEMA_VERSION,
					run_index: runIndex,
					challenge_group_id: challenge.challenge_group_id,
					prompt_text: challenge.prompt_text,
					target_date_iso: challenge.target_date_iso,
					attempt_count: 0,
					click_count: 0,
					keypress_count: 0,
					is_correct: false
				},
				{ owner }
			);
		});

		const runsList = co.list(StudyChallengeRun).create(runs, { owner });

		return StudyInputRound.create(
			{
				schema_version: STUDY_SCHEMA_VERSION,
				round_index: roundIndex,
				picker_id: round.picker_id,
				picker_label: round.picker_label,
				status: 'pending' as const,
				current_challenge_index: 0,
				runs: runsList
			},
			{ owner }
		);
	});

	const roundsList = co.list(StudyInputRound).create(rounds, { owner });

	return StudySession.create(
		{
			schema_version: STUDY_SCHEMA_VERSION,
			created_by_account_id: createdByAccountId,
			// blueprint.created_at_ms lets tests inject a fixed timestamp for
			// deterministic snapshots. In production the admin caller omits it
			// and Date.now() wins.
			created_at_ms: blueprint.created_at_ms ?? Date.now(),
			session_index: blueprint.session_index,
			// Generated at creation so the participant never has to invent or
			// look up an identifier. Stays pseudonymous (random UUID) and is
			// stable for the session — metrics and admin display read it as-is.
			participant_id: blueprint.participant_id ?? crypto.randomUUID(),
			// Session starts 'pending_participant' — created by admin but not
			// yet claimed. The participant identity write on Start transitions
			// to 'in_progress'.
			status: 'pending_participant',
			current_round_index: 0,
			timezone: blueprint.timezone,
			locale: blueprint.locale,
			rounds: roundsList
		},
		{ owner }
	);
}
