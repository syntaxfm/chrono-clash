import { STUDY_PICKERS } from '$lib/components/date-picker-study/pickers/catalog';

// Ordered palette indexed by picker position in STUDY_PICKERS. Adding a new
// picker wraps around the palette; renaming a picker_id needs no update here.
const LEADERBOARD_PALETTE = [
	'var(--indigo-8)',
	'var(--green-8)',
	'var(--orange-8)',
	'var(--pink-8)',
	'var(--teal-8)',
	'var(--amber-8)'
] as const;

export const PICKER_COLOR: Record<string, string> = Object.fromEntries(
	STUDY_PICKERS.map((picker, i) => [picker.id, LEADERBOARD_PALETTE[i % LEADERBOARD_PALETTE.length]])
);
