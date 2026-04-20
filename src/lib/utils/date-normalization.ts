// Strict date key format used across the study (spec §7). Storage and
// correctness comparisons always use this exact shape, so normalizing at the
// engine boundary means the rest of the app can trust string equality.
export const PLAIN_DATE_KEY_FORMAT = 'YYYY-MM-DD';

const STRICT_PLAIN_DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
// Accept looser picker output (e.g. "2026-1-5") so typed-input adapters that
// live-bind mid-type aren't forced to zero-pad before each emit. The strict
// form is produced below.
const LOOSE_PLAIN_DATE_KEY = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

export function isPlainDateKey(value: unknown): value is string {
	return typeof value === 'string' && STRICT_PLAIN_DATE_KEY.test(value);
}

// Normalize a picker-emitted value to strict YYYY-MM-DD, or return null if the
// input isn't recognizable as a date key. Callers pass the result straight
// into strict equality against a challenge target; returning null (not a
// coerced partial) means "no emission worth counting yet" to the engine.
export function normalizePlainDateKey(value: string): string | null {
	const match = LOOSE_PLAIN_DATE_KEY.exec(value);
	if (!match) return null;
	const [, year, month, day] = match;
	const monthNum = Number(month);
	const dayNum = Number(day);
	if (monthNum < 1 || monthNum > 12) return null;
	if (dayNum < 1 || dayNum > 31) return null;
	return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Strict equality between two plain date keys. Inputs that aren't valid
// normalized keys return false rather than throw — this is called on every
// picker emission and should never kill the runner on malformed input.
export function plainDateKeysEqual(a: string, b: string): boolean {
	return isPlainDateKey(a) && isPlainDateKey(b) && a === b;
}

// Study targets are either a single plain date key or a range expressed as
// "YYYY-MM-DD/YYYY-MM-DD". The presence of "/" is the discriminator, which
// lets the runner compare picker output to a stored target by string
// equality without a parallel "is this a range?" flag.
export function isRangeStudyTargetValue(value: string): boolean {
	return value.includes('/');
}

// Normalize a picker-emitted value for the study. Delegates to
// normalizePlainDateKey for single dates; for ranges, splits on "/",
// normalizes each half, and rejoins. Returns null on any malformed half so
// the runner treats partial/invalid emissions as "not yet a candidate".
// A same-day range (start === end) collapses to a single date key so pickers
// that represent single selections as "YYYY-MM-DD/YYYY-MM-DD" compare equal
// to single-date challenge targets authored as "YYYY-MM-DD".
export function normalizeStudyTargetValue(value: string): string | null {
	if (!isRangeStudyTargetValue(value)) {
		return normalizePlainDateKey(value);
	}
	const parts = value.split('/');
	if (parts.length !== 2) return null;
	const start = normalizePlainDateKey(parts[0]);
	const end = normalizePlainDateKey(parts[1]);
	if (start === null || end === null) return null;
	if (start === end) return start;
	return `${start}/${end}`;
}
