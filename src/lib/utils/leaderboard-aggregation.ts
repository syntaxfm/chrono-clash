import { STUDY_CHALLENGE_GROUPS } from '$lib/components/date-picker-study/challenges';
import { STUDY_PICKERS } from '$lib/components/date-picker-study/pickers/catalog';
import type { LoadedStudySession } from '$lib/components/date-picker-study/admin-workspace';

// One picker's rolled-up score across every session in the index. Every field
// is populated (no undefined leaf values) so chart code can read them without
// branching: zero sample counts return 0 for each metric.
export type PickerLeaderboardRow = {
	picker_id: string;
	picker_label: string;
	// Number of completed rounds that contributed to ratings and timings.
	sample_size: number;
	// Means on the 1–5 scale. 0 when sample_size is 0.
	rating_design_mean: number;
	rating_ease_of_use_mean: number;
	rating_magicalness_mean: number;
	// Composite score on a 0–15 scale: sum of the three dimension means.
	composite_score: number;
	// Number of runs across all sessions for this picker.
	runs_total: number;
	// Number of correct runs.
	runs_correct: number;
	// Correctness ratio in [0, 1].
	correctness_rate: number;
	// Mean of per-run elapsed_ms where recorded. 0 when no samples.
	mean_elapsed_ms: number;
};

export type RatingDimension = 'design' | 'ease_of_use' | 'magicalness';

export const RATING_DIMENSIONS: readonly RatingDimension[] = [
	'design',
	'ease_of_use',
	'magicalness'
] as const;

export const RATING_DIMENSION_LABEL: Record<RatingDimension, string> = {
	design: 'Design',
	ease_of_use: 'Ease of use',
	magicalness: 'Magicalness'
};

// Per-picker lower/upper bounds for elapsed_ms. Runs outside the range are
// treated as outliers by the speed aggregators when this map is supplied.
export type OutlierBoundsByPicker = Map<string, { lower: number; upper: number }>;

function quantile(sorted: readonly number[], q: number): number {
	const pos = (sorted.length - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;
	const next = sorted[base + 1];
	if (next !== undefined) return sorted[base] + rest * (next - sorted[base]);
	return sorted[base];
}

// IQR-based outlier bounds per picker across every recorded run. Pickers with
// fewer than 4 samples get unbounded ranges — IQR isn't meaningful on tiny
// samples and we'd rather keep all their data than drop it on noise.
export function computeOutlierBoundsByPicker(
	sessions: readonly (LoadedStudySession | null)[]
): OutlierBoundsByPicker {
	const samples = new Map<string, number[]>();
	for (const session of sessions) {
		if (!session) continue;
		for (const round of session.rounds) {
			if (!round) continue;
			for (const run of round.runs) {
				if (!run) continue;
				if (run.elapsed_ms === undefined) continue;
				const arr = samples.get(round.picker_id) ?? [];
				arr.push(run.elapsed_ms);
				samples.set(round.picker_id, arr);
			}
		}
	}

	const bounds: OutlierBoundsByPicker = new Map();
	for (const [pickerId, arr] of samples) {
		if (arr.length < 4) {
			bounds.set(pickerId, { lower: -Infinity, upper: Infinity });
			continue;
		}
		const sorted = [...arr].sort((a, b) => a - b);
		const q1 = quantile(sorted, 0.25);
		const q3 = quantile(sorted, 0.75);
		const iqr = q3 - q1;
		bounds.set(pickerId, { lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr });
	}
	return bounds;
}

function isOutlier(
	bounds: OutlierBoundsByPicker | undefined,
	pickerId: string,
	elapsedMs: number
): boolean {
	if (!bounds) return false;
	const b = bounds.get(pickerId);
	if (!b) return false;
	return elapsedMs < b.lower || elapsedMs > b.upper;
}

// Rating fields are optional on the schema — an in-progress round may have
// only two of three set. Partial ratings still count for the dimensions that
// are filled; they do NOT contribute to missing dimensions.
export function aggregatePickerLeaderboard(
	sessions: readonly (LoadedStudySession | null)[],
	outlierBounds?: OutlierBoundsByPicker
): PickerLeaderboardRow[] {
	type Acc = {
		picker_label: string;
		sample_size: number;
		design_sum: number;
		design_count: number;
		ease_sum: number;
		ease_count: number;
		magic_sum: number;
		magic_count: number;
		runs_total: number;
		runs_correct: number;
		elapsed_sum: number;
		elapsed_count: number;
	};

	const accs = new Map<string, Acc>();
	for (const picker of STUDY_PICKERS) {
		accs.set(picker.id, {
			picker_label: picker.label,
			sample_size: 0,
			design_sum: 0,
			design_count: 0,
			ease_sum: 0,
			ease_count: 0,
			magic_sum: 0,
			magic_count: 0,
			runs_total: 0,
			runs_correct: 0,
			elapsed_sum: 0,
			elapsed_count: 0
		});
	}

	for (const session of sessions) {
		if (!session) continue;
		for (const round of session.rounds) {
			if (!round) continue;
			const acc = accs.get(round.picker_id);
			if (!acc) continue;

			acc.sample_size += 1;

			if (round.rating_design !== undefined) {
				acc.design_sum += round.rating_design;
				acc.design_count += 1;
			}
			if (round.rating_ease_of_use !== undefined) {
				acc.ease_sum += round.rating_ease_of_use;
				acc.ease_count += 1;
			}
			if (round.rating_magicalness !== undefined) {
				acc.magic_sum += round.rating_magicalness;
				acc.magic_count += 1;
			}

			for (const run of round.runs) {
				if (!run) continue;
				acc.runs_total += 1;
				if (run.is_correct) acc.runs_correct += 1;
				if (run.elapsed_ms !== undefined) {
					if (isOutlier(outlierBounds, round.picker_id, run.elapsed_ms)) continue;
					acc.elapsed_sum += run.elapsed_ms;
					acc.elapsed_count += 1;
				}
			}
		}
	}

	const rows: PickerLeaderboardRow[] = [];
	for (const picker of STUDY_PICKERS) {
		const acc = accs.get(picker.id);
		if (!acc) continue;
		const design = acc.design_count === 0 ? 0 : acc.design_sum / acc.design_count;
		const ease = acc.ease_count === 0 ? 0 : acc.ease_sum / acc.ease_count;
		const magic = acc.magic_count === 0 ? 0 : acc.magic_sum / acc.magic_count;
		rows.push({
			picker_id: picker.id,
			picker_label: acc.picker_label,
			sample_size: acc.sample_size,
			rating_design_mean: design,
			rating_ease_of_use_mean: ease,
			rating_magicalness_mean: magic,
			composite_score: design + ease + magic,
			runs_total: acc.runs_total,
			runs_correct: acc.runs_correct,
			correctness_rate: acc.runs_total === 0 ? 0 : acc.runs_correct / acc.runs_total,
			mean_elapsed_ms: acc.elapsed_count === 0 ? 0 : acc.elapsed_sum / acc.elapsed_count
		});
	}

	return rows;
}

// Per-prompt timing, keyed by the authored prompt_text. Used to surface
// prompts where multiple pickers struggled (or diverged) across the session
// history. Only prompts covered by ≥2 pickers are returned — a prompt with a
// single picker's data has no comparative signal. Within a returned row,
// `pickers` includes every picker in STUDY_PICKERS (run_count=0 when that
// picker hasn't seen this prompt yet) so chart code can rely on a stable
// ordering and skip zero-count bars explicitly.
export type PromptTimingRow = {
	prompt_text: string;
	challenge_group_id: string;
	challenge_group_label: string;
	pickers: PickerCategoryTiming[];
	// Max mean_ms across pickers with run_count > 0. 0 when nobody has a run.
	// Pre-computed so the chart layout can size the x-axis without re-walking.
	max_mean_ms: number;
};

const MIN_PICKERS_PER_PROMPT = 2;

export function aggregateSpeedByPrompt(
	sessions: readonly (LoadedStudySession | null)[],
	outlierBounds?: OutlierBoundsByPicker
): PromptTimingRow[] {
	type PromptAcc = {
		challenge_group_id: string;
		pickers: Map<string, { sum: number; count: number }>;
	};

	const prompts = new Map<string, PromptAcc>();

	for (const session of sessions) {
		if (!session) continue;
		for (const round of session.rounds) {
			if (!round) continue;
			const pickerId = round.picker_id;
			for (const run of round.runs) {
				if (!run) continue;
				if (run.elapsed_ms === undefined) continue;
				if (isOutlier(outlierBounds, pickerId, run.elapsed_ms)) continue;
				let acc = prompts.get(run.prompt_text);
				if (!acc) {
					acc = {
						challenge_group_id: run.challenge_group_id,
						pickers: new Map()
					};
					prompts.set(run.prompt_text, acc);
				}
				const pickerAcc = acc.pickers.get(pickerId) ?? { sum: 0, count: 0 };
				pickerAcc.sum += run.elapsed_ms;
				pickerAcc.count += 1;
				acc.pickers.set(pickerId, pickerAcc);
			}
		}
	}

	const groupLabelById = new Map(
		STUDY_CHALLENGE_GROUPS.map((group) => [group.id, group.label])
	);

	const rows: PromptTimingRow[] = [];
	for (const [promptText, acc] of prompts) {
		if (acc.pickers.size < MIN_PICKERS_PER_PROMPT) continue;

		const pickerTimings: PickerCategoryTiming[] = STUDY_PICKERS.map((picker) => {
			const data = acc.pickers.get(picker.id) ?? { sum: 0, count: 0 };
			return {
				picker_id: picker.id,
				picker_label: picker.label,
				mean_ms: data.count === 0 ? 0 : data.sum / data.count,
				run_count: data.count
			};
		});

		const maxMean = pickerTimings.reduce(
			(max, p) => (p.run_count > 0 && p.mean_ms > max ? p.mean_ms : max),
			0
		);

		rows.push({
			prompt_text: promptText,
			challenge_group_id: acc.challenge_group_id,
			challenge_group_label: groupLabelById.get(acc.challenge_group_id) ?? acc.challenge_group_id,
			pickers: pickerTimings,
			max_mean_ms: maxMean
		});
	}

	rows.sort((a, b) => b.max_mean_ms - a.max_mean_ms);
	return rows;
}

export function getRatingForDimension(
	row: PickerLeaderboardRow,
	dimension: RatingDimension
): number {
	if (dimension === 'design') return row.rating_design_mean;
	if (dimension === 'ease_of_use') return row.rating_ease_of_use_mean;
	return row.rating_magicalness_mean;
}

// Per-picker timing within a single challenge category. run_count is kept so
// the UI can hide empty cells (no runs) without guessing from mean_ms === 0,
// since 0ms is a theoretically legal (if unrealistic) measurement.
export type PickerCategoryTiming = {
	picker_id: string;
	picker_label: string;
	mean_ms: number;
	run_count: number;
};

export type CategoryTimingRow = {
	challenge_group_id: string;
	challenge_group_label: string;
	pickers: PickerCategoryTiming[];
};

// Mean elapsed_ms keyed by (challenge_group, picker). Categories with zero
// recorded runs across every picker are omitted — no reason to render an
// empty band. Within a category, every picker in STUDY_PICKERS is present
// (mean_ms=0, run_count=0 when a picker hasn't been tried on that category),
// so the caller can rely on a stable picker order per row for charts.
export function aggregateSpeedByCategory(
	sessions: readonly (LoadedStudySession | null)[],
	outlierBounds?: OutlierBoundsByPicker
): CategoryTimingRow[] {
	const groups = new Map<string, Map<string, { sum: number; count: number }>>();

	for (const session of sessions) {
		if (!session) continue;
		for (const round of session.rounds) {
			if (!round) continue;
			const pickerId = round.picker_id;
			for (const run of round.runs) {
				if (!run) continue;
				if (run.elapsed_ms === undefined) continue;
				if (isOutlier(outlierBounds, pickerId, run.elapsed_ms)) continue;
				const groupId = run.challenge_group_id;
				let pickerMap = groups.get(groupId);
				if (!pickerMap) {
					pickerMap = new Map();
					groups.set(groupId, pickerMap);
				}
				const acc = pickerMap.get(pickerId) ?? { sum: 0, count: 0 };
				acc.sum += run.elapsed_ms;
				acc.count += 1;
				pickerMap.set(pickerId, acc);
			}
		}
	}

	const rows: CategoryTimingRow[] = [];
	for (const group of STUDY_CHALLENGE_GROUPS) {
		const pickerMap = groups.get(group.id);
		if (!pickerMap || pickerMap.size === 0) continue;
		const pickers: PickerCategoryTiming[] = STUDY_PICKERS.map((picker) => {
			const acc = pickerMap.get(picker.id) ?? { sum: 0, count: 0 };
			return {
				picker_id: picker.id,
				picker_label: picker.label,
				mean_ms: acc.count === 0 ? 0 : acc.sum / acc.count,
				run_count: acc.count
			};
		});
		rows.push({
			challenge_group_id: group.id,
			challenge_group_label: group.label,
			pickers
		});
	}

	return rows;
}
