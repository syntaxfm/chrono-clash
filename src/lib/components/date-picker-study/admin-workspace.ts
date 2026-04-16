import { Group, type Loaded } from 'jazz-tools';

import { STUDY_CHALLENGE_GROUPS } from '$lib/components/date-picker-study/challenges';
import { STUDY_PICKERS } from '$lib/components/date-picker-study/pickers';
import {
	STUDY_SESSION_INDEX_RESOLVE,
	type StudySession,
	type StudySessionIndex
} from '$lib/components/date-picker-study/schema';
import {
	createStudySession,
	getPickerOrderForSession,
	type StudyRoundBlueprint
} from '$lib/components/date-picker-study/session-factory';

// Matches the locked default from Dex task 7c3b5xi0: 5 challenges per picker,
// overridable per session. Admin create page exposes the override; this
// default applies when the caller doesn't pass one.
export const DEFAULT_CHALLENGES_PER_PICKER = 5;

export type LoadedStudySessionIndex = Loaded<
	typeof StudySessionIndex,
	typeof STUDY_SESSION_INDEX_RESOLVE
>;

export type LoadedStudySession = Loaded<
	typeof StudySession,
	(typeof STUDY_SESSION_INDEX_RESOLVE)['sessions']['$each']
>;

export type CreateAdminSessionOptions = {
	challengesPerPicker?: number;
	createdAtMs?: number;
};

// Pick three distinct challenge groups for a new session. Deterministic
// rotation keyed on sessionIndex so the group trio cycles smoothly (no random
// cluster of same-topic groups in a row) and is reproducible from the session
// record alone. Requires ≥ 3 authored groups; challenges.ts is responsible
// for that.
function pickChallengeGroupsForSession(
	sessionIndex: number
): readonly (typeof STUDY_CHALLENGE_GROUPS)[number][] {
	if (STUDY_CHALLENGE_GROUPS.length < STUDY_PICKERS.length) {
		throw new Error(
			`need at least ${STUDY_PICKERS.length} challenge groups, have ${STUDY_CHALLENGE_GROUPS.length}`
		);
	}

	const total = STUDY_CHALLENGE_GROUPS.length;
	const start = sessionIndex % total;
	return Array.from({ length: STUDY_PICKERS.length }, (_, offset) => {
		return STUDY_CHALLENGE_GROUPS[(start + offset) % total];
	});
}

// Create a StudySession and append it to the admin's index.
//
// Ownership model (intentionally simple):
// - The index itself is private to the admin — created by the migration with
//   default per-account ownership.
// - Each session gets its OWN Group made public-writable, so anyone with the
//   session CoValue ID (which is the participant URL) can read and write it.
//   That's what makes "anyone with the session URL can take the study" work
//   without any account/invite dance for participants.
// - The session's Group, nested rounds, and nested runs all share the same
//   owner (threaded by the factory) so participant reads/writes succeed at
//   every level of the deep resolve.
//
// Order of operations: read `sessions.length` BEFORE creating so
// session_index and counterbalance assignment match the final list position;
// then push the fully-built session. createdByAccountId is passed explicitly
// from AccountCoState so the attribution field matches its documented meaning.
export function createAdminSession(
	index: LoadedStudySessionIndex,
	createdByAccountId: string,
	options: CreateAdminSessionOptions = {}
): LoadedStudySession {
	const challengesPerPicker = options.challengesPerPicker ?? DEFAULT_CHALLENGES_PER_PICKER;
	if (!Number.isInteger(challengesPerPicker) || challengesPerPicker < 1) {
		throw new TypeError('challengesPerPicker must be a positive integer');
	}

	const sessionIndex = index.sessions.length;

	const pickerOrder = getPickerOrderForSession(sessionIndex);
	const challengeGroupTrio = pickChallengeGroupsForSession(sessionIndex);

	const rounds: StudyRoundBlueprint[] = pickerOrder.map((pickerSlot, roundIndex) => {
		const picker = STUDY_PICKERS[pickerSlot];
		const group = challengeGroupTrio[roundIndex];
		if (group.challenges.length < challengesPerPicker) {
			throw new Error(
				`challenge group "${group.id}" has ${group.challenges.length} challenges but ${challengesPerPicker} are needed`
			);
		}

		return {
			picker_id: picker.id,
			picker_label: picker.label,
			challenges: group.challenges.slice(0, challengesPerPicker).map((challenge) => ({
				challenge_group_id: group.id,
				prompt_text: challenge.prompt,
				target_date_iso: challenge.target_date_iso
			}))
		};
	});

	const sessionGroup = Group.create();
	sessionGroup.makePublic('writer');

	const session = createStudySession(
		{
			created_by_account_id: createdByAccountId,
			session_index: sessionIndex,
			created_at_ms: options.createdAtMs,
			rounds
		},
		{ owner: sessionGroup }
	);

	index.sessions.$jazz.push(session);

	return session;
}

// Summary helpers kept pure so the dashboard and detail pages read the same
// numbers. Walks already-loaded rounds/runs; the resolve query guarantees
// they're available without extra awaits.
export function countCompletedRounds(session: LoadedStudySession): number {
	return session.rounds.filter((round) => round?.status === 'completed').length;
}

export function countCompletedRuns(session: LoadedStudySession): number {
	let completed = 0;
	for (const round of session.rounds) {
		if (!round) continue;
		for (const run of round.runs) {
			if (run?.is_correct) completed += 1;
		}
	}
	return completed;
}

export function countTotalRuns(session: LoadedStudySession): number {
	let total = 0;
	for (const round of session.rounds) {
		if (!round) continue;
		total += round.runs.length;
	}
	return total;
}
