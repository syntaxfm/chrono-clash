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
	{ id: 'hot_date', label: 'Hot Date' },
	{ id: 'date_range_picker', label: 'Date Range Picker' },
	{ id: 'magic_date_picker', label: 'Magic Date Picker' }
] as const;

export const STUDY_INPUT_COUNT = STUDY_PICKERS.length;

export type StudyPickerDefinition = (typeof STUDY_PICKERS)[number];
