import { STUDY_TARGET_VALUE_REGEX } from '$lib/components/date-picker-study/schema';
import { addDays, addMonths, addWeeks, addYears, nextWeekday } from '$lib/utils/date-math';

// Authored challenge groups for the study. Each group is a themed batch of
// prompts at similar difficulty; the admin session factory picks 3 of these
// (one per input round) so every participant sees a different group per
// picker, which reduces memory/learning effects (spec §3.4).
//
// Authoring rules (enforce at module load, not at session creation, so bad
// data fails loudly during build/dev, not mid-study):
// - every target uses YYYY-MM-DD for single-date challenges, or
//   YYYY-MM-DD/YYYY-MM-DD for range challenges (startISO/endISO)
// - targets that depend on "today" (e.g. "two weeks from today") are
//   authored as `(now: Date) => string` resolvers; createAdminSession
//   invokes them with the admin's now at creation time, so the stored
//   target_date_iso is always a concrete ISO string
// - every group has ≥ 5 challenges so a default challenges_per_picker=5
//   session can always be built
// - challenge_group_id is stable across sessions and used for analysis
export type StudyChallengeTargetResolver = (now: Date) => string;

export type StudyChallengeDefinition = {
	readonly prompt: string;
	readonly target_date_iso: string | StudyChallengeTargetResolver;
};

export type StudyChallengeGroupDefinition = {
	readonly id: string;
	readonly label: string;
	readonly challenges: readonly StudyChallengeDefinition[];
};

// Minimum challenges authored per group. Must be ≥ STUDY_INPUT_COUNT (3)
// because each round draws a different variation per category, indexed by
// round_index (round 0 → challenge[0], round 1 → challenge[1], …).
const MIN_CHALLENGES_PER_GROUP = 3;

const MONDAY = 1;
const FRIDAY = 5;

const RAW_CHALLENGE_GROUPS = [
	{
		id: 'holidays',
		label: 'Holidays',
		challenges: [
			{ prompt: "New Year's Day 2027", target_date_iso: '2027-01-01' },
			{ prompt: 'Valentine’s Day 2027', target_date_iso: '2027-02-14' },
			{ prompt: 'Easter Sunday 2027', target_date_iso: '2027-03-28' },
			{ prompt: 'Halloween 2028', target_date_iso: '2028-10-31' },
			{ prompt: 'Christmas Day 2026', target_date_iso: '2026-12-25' }
		]
	},
	{
		id: 'exact-date-range',
		label: 'Exact Date Range',
		challenges: [
			{ prompt: 'March 14, 2026 to March 28, 2026', target_date_iso: '2026-03-14/2026-03-28' },
			{ prompt: 'July 1, 2027 to July 15, 2027', target_date_iso: '2027-07-01/2027-07-15' },
			{
				prompt: 'November 10, 2026 to November 24, 2026',
				target_date_iso: '2026-11-10/2026-11-24'
			},
			{
				prompt: 'February 3, 2027 to February 17, 2027',
				target_date_iso: '2027-02-03/2027-02-17'
			},
			{
				prompt: 'September 5, 2028 to September 19, 2028',
				target_date_iso: '2028-09-05/2028-09-19'
			}
		]
	},
	{
		id: 'relative-time',
		label: 'Relative Time',
		challenges: [
			{
				prompt: 'Nine days after next Monday',
				target_date_iso: (now: Date) => addDays(nextWeekday(now, MONDAY), 9)
			},
			{
				prompt: 'Two weeks from today',
				target_date_iso: (now: Date) => addWeeks(now, 2)
			},
			{
				prompt: 'One month from today',
				target_date_iso: (now: Date) => addMonths(now, 1)
			},
			{
				prompt: 'Five days before next Friday',
				target_date_iso: (now: Date) => addDays(nextWeekday(now, FRIDAY), -5)
			},
			{
				prompt: 'Three weeks from today',
				target_date_iso: (now: Date) => addWeeks(now, 3)
			}
		]
	},
	{
		id: 'long-date-range',
		label: 'Long Date Range',
		challenges: [
			{ prompt: 'March 28, 1988 to March 14, 2026', target_date_iso: '1988-03-28/2026-03-14' },
			{ prompt: 'July 4, 1976 to July 4, 2026', target_date_iso: '1976-07-04/2026-07-04' },
			{
				prompt: 'January 1, 2000 to December 31, 2027',
				target_date_iso: '2000-01-01/2027-12-31'
			},
			{ prompt: 'June 15, 1969 to June 15, 2029', target_date_iso: '1969-06-15/2029-06-15' },
			{
				prompt: 'October 29, 1929 to October 29, 2028',
				target_date_iso: '1929-10-29/2028-10-29'
			}
		]
	},
	{
		id: 'reverse-date',
		label: 'Reverse Date',
		challenges: [
			{
				prompt: 'Five years ago until two weeks ago',
				target_date_iso: (now: Date) => `${addYears(now, -5)}/${addDays(now, -14)}`
			},
			{
				prompt: 'Ten years ago until one year ago',
				target_date_iso: (now: Date) => `${addYears(now, -10)}/${addYears(now, -1)}`
			},
			{
				prompt: '30 days ago until yesterday',
				target_date_iso: (now: Date) => `${addDays(now, -30)}/${addDays(now, -1)}`
			},
			{
				prompt: 'Three months ago until seven days ago',
				target_date_iso: (now: Date) => `${addMonths(now, -3)}/${addDays(now, -7)}`
			},
			{
				prompt: 'One year ago until two days ago',
				target_date_iso: (now: Date) => `${addYears(now, -1)}/${addDays(now, -2)}`
			}
		]
	}
] as const satisfies readonly StudyChallengeGroupDefinition[];

// Resolve a challenge's target to a concrete ISO string at session creation.
// Functions get invoked with the admin's "now"; literal strings pass through.
// The result is validated against STUDY_TARGET_VALUE_REGEX so a buggy resolver
// can't slip malformed data past the factory.
export function resolveChallengeTarget(
	challenge: StudyChallengeDefinition,
	now: Date
): string {
	const target =
		typeof challenge.target_date_iso === 'function'
			? challenge.target_date_iso(now)
			: challenge.target_date_iso;
	if (!STUDY_TARGET_VALUE_REGEX.test(target)) {
		throw new Error(
			`resolved target "${target}" for prompt "${challenge.prompt}" does not match YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD format`
		);
	}
	return target;
}

// Fail loudly at module load if a group is malformed. A thrown error here
// surfaces in dev/build immediately; the alternative (validating only in the
// session factory) would let a broken group ship and only blow up when an
// admin tried to use it, mid-study. Resolver functions get exercised with a
// fixed probe date so authoring bugs (wrong helper, typo) also fail here.
const MODULE_LOAD_PROBE_DATE = new Date(2024, 0, 1);

for (const group of RAW_CHALLENGE_GROUPS) {
	if (group.challenges.length < MIN_CHALLENGES_PER_GROUP) {
		throw new Error(
			`challenge group "${group.id}" must have at least ${MIN_CHALLENGES_PER_GROUP} challenges`
		);
	}
	for (const challenge of group.challenges) {
		resolveChallengeTarget(challenge, MODULE_LOAD_PROBE_DATE);
	}
}

const seenGroupIds = new Set<string>();
for (const group of RAW_CHALLENGE_GROUPS) {
	if (seenGroupIds.has(group.id)) {
		throw new Error(`duplicate challenge group id "${group.id}"`);
	}
	seenGroupIds.add(group.id);
}

export const STUDY_CHALLENGE_GROUPS: readonly StudyChallengeGroupDefinition[] =
	RAW_CHALLENGE_GROUPS;

export function getChallengeGroupById(id: string): StudyChallengeGroupDefinition {
	const group = STUDY_CHALLENGE_GROUPS.find((candidate) => candidate.id === id);
	if (!group) {
		throw new Error(`unknown challenge group id "${id}"`);
	}
	return group;
}
