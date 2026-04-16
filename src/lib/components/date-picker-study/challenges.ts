import { PLAIN_DATE_KEY_REGEX } from '$lib/components/date-picker-study/schema';

// Authored challenge groups for the study. Each group is a themed batch of
// prompts at similar difficulty; the admin session factory picks 3 of these
// (one per input round) so every participant sees a different group per
// picker, which reduces memory/learning effects (spec §3.4).
//
// Authoring rules (enforce at module load, not at session creation, so bad
// data fails loudly during build/dev, not mid-study):
// - every target date uses YYYY-MM-DD
// - every group has ≥ 5 challenges so a default challenges_per_picker=5
//   session can always be built
// - challenge_group_id is stable across sessions and used for analysis
export type StudyChallengeDefinition = {
	readonly prompt: string;
	readonly target_date_iso: string;
};

export type StudyChallengeGroupDefinition = {
	readonly id: string;
	readonly label: string;
	readonly challenges: readonly StudyChallengeDefinition[];
};

// Minimum challenges authored per group. Must be ≥ the default
// challenges_per_picker (5) so every group supports a full-length round.
const MIN_CHALLENGES_PER_GROUP = 5;

const RAW_CHALLENGE_GROUPS = [
	{
		id: 'us-holidays',
		label: 'US Holidays',
		challenges: [
			{ prompt: 'Thanksgiving 2026 (US)', target_date_iso: '2026-11-26' },
			{ prompt: 'Labor Day 2027 (US)', target_date_iso: '2027-09-06' },
			{ prompt: 'Memorial Day 2026 (US)', target_date_iso: '2026-05-25' },
			{ prompt: 'Independence Day 2028 (US)', target_date_iso: '2028-07-04' },
			{ prompt: "New Year's Day 2027", target_date_iso: '2027-01-01' },
			{ prompt: 'Halloween 2028', target_date_iso: '2028-10-31' }
		]
	},
	{
		id: 'specific-dates',
		label: 'Specific Dates',
		challenges: [
			{ prompt: 'June 15, 2026', target_date_iso: '2026-06-15' },
			{ prompt: 'March 3, 2027', target_date_iso: '2027-03-03' },
			{ prompt: 'October 22, 2025', target_date_iso: '2025-10-22' },
			{ prompt: 'February 29, 2028', target_date_iso: '2028-02-29' },
			{ prompt: 'September 10, 2026', target_date_iso: '2026-09-10' },
			{ prompt: 'August 1, 2027', target_date_iso: '2027-08-01' }
		]
	},
	{
		id: 'nth-weekday',
		label: 'Nth Weekday Of Month',
		challenges: [
			{ prompt: 'The second Tuesday of November 2026', target_date_iso: '2026-11-10' },
			{ prompt: 'The third Friday of March 2027', target_date_iso: '2027-03-19' },
			{ prompt: 'The first Monday of June 2026', target_date_iso: '2026-06-01' },
			{ prompt: 'The last Thursday of January 2028', target_date_iso: '2028-01-27' },
			{ prompt: 'The fourth Wednesday of July 2026', target_date_iso: '2026-07-22' },
			{ prompt: 'The second Saturday of April 2027', target_date_iso: '2027-04-10' }
		]
	},
	{
		id: 'relative-to-holiday',
		label: 'Relative To Holiday',
		challenges: [
			{ prompt: 'The day after Halloween 2027', target_date_iso: '2027-11-01' },
			{ prompt: 'The Friday before Memorial Day 2028', target_date_iso: '2028-05-26' },
			{ prompt: 'Two days after Valentine’s Day 2027', target_date_iso: '2027-02-16' },
			{ prompt: 'The Tuesday following July 4, 2026', target_date_iso: '2026-07-07' },
			{ prompt: 'The Monday after Labor Day 2026', target_date_iso: '2026-09-14' },
			{ prompt: 'The Friday before Christmas 2025', target_date_iso: '2025-12-19' }
		]
	}
] as const satisfies readonly StudyChallengeGroupDefinition[];

// Fail loudly at module load if a group is malformed. A thrown error here
// surfaces in dev/build immediately; the alternative (validating only in the
// session factory) would let a broken group ship and only blow up when an
// admin tried to use it, mid-study.
for (const group of RAW_CHALLENGE_GROUPS) {
	if (group.challenges.length < MIN_CHALLENGES_PER_GROUP) {
		throw new Error(
			`challenge group "${group.id}" must have at least ${MIN_CHALLENGES_PER_GROUP} challenges`
		);
	}
	for (const challenge of group.challenges) {
		if (!PLAIN_DATE_KEY_REGEX.test(challenge.target_date_iso)) {
			throw new Error(
				`challenge group "${group.id}" prompt "${challenge.prompt}" has invalid target_date_iso`
			);
		}
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
