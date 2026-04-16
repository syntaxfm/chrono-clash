// Canonical picker catalog. Counterbalance permutations in
// session-factory.ts index into this list, so the order and length are
// load-bearing — do not reorder entries, append only.
//
// `id` is the stable analysis/metric grouping key (spec §8.3 `picker_id`).
// Once an id is persisted on a StudyInputRound it must never change, or
// historical records stop joining cleanly across schema versions.
//
// `label` is presentation only (spec §6.3 `picker_label`: "Input A/B/C"). Free
// to vary per cohort without invalidating history because analysis keys off
// `id`.
export const STUDY_PICKERS = [
	{ id: 'input_a', label: 'Input A' },
	{ id: 'input_b', label: 'Input B' },
	{ id: 'input_c', label: 'Input C' }
] as const;

export const STUDY_INPUT_COUNT = STUDY_PICKERS.length;

export type StudyPickerDefinition = (typeof STUDY_PICKERS)[number];
