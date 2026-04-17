import { Group, type Loaded } from 'jazz-tools';

import { STUDY_CHALLENGE_GROUPS } from '$lib/components/date-picker-study/challenges';
import { STUDY_INPUT_COUNT, STUDY_PICKERS } from '$lib/components/date-picker-study/pickers/catalog';
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

// Number of categories sampled per round. Each round contains one challenge
// from each sampled category, so this also equals the round length. Capped at
// the authored group count by createAdminSession.
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

// Pick `count` distinct challenge groups for a new session. Deterministic
// rotation keyed on sessionIndex so category sets cycle smoothly across
// sessions and are reproducible from the session record alone. The same
// category set is reused for every round in a session — what differs per
// round is the variation index drawn from each group (see createAdminSession).
function pickChallengeGroupsForSession(
	sessionIndex: number,
	count: number
): readonly (typeof STUDY_CHALLENGE_GROUPS)[number][] {
	const total = STUDY_CHALLENGE_GROUPS.length;
	if (count > total) {
		throw new Error(
			`requested ${count} categories but only ${total} challenge groups are authored`
		);
	}

	const start = sessionIndex % total;
	return Array.from({ length: count }, (_, offset) => {
		return STUDY_CHALLENGE_GROUPS[(start + offset) % total];
	});
}

// Fisher-Yates in-place. Used to randomize the order of categories within a
// round so picker A doesn't always start with the same category. Uses
// Math.random because category-presentation order is not a counterbalanced
// variable for analysis (picker order is — see getPickerOrderForSession).
function shuffleInPlace<T>(items: T[]): T[] {
	for (let i = items.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
	return items;
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
	const sessionCategories = pickChallengeGroupsForSession(sessionIndex, challengesPerPicker);

	// Each category must supply a distinct variation per round; round_index
	// indexes into challenges[] (round 0 → [0], round 1 → [1], …), so a group
	// with fewer than STUDY_INPUT_COUNT challenges would collide.
	for (const group of sessionCategories) {
		if (group.challenges.length < STUDY_INPUT_COUNT) {
			throw new Error(
				`challenge group "${group.id}" has ${group.challenges.length} challenges but ${STUDY_INPUT_COUNT} are needed`
			);
		}
	}

	const rounds: StudyRoundBlueprint[] = pickerOrder.map((pickerSlot, roundIndex) => {
		const picker = STUDY_PICKERS[pickerSlot];

		const challenges = sessionCategories.map((group) => {
			const challenge = group.challenges[roundIndex];
			return {
				challenge_group_id: group.id,
				prompt_text: challenge.prompt,
				target_date_iso: challenge.target_date_iso
			};
		});

		return {
			picker_id: picker.id,
			picker_label: picker.label,
			challenges: shuffleInPlace(challenges)
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
