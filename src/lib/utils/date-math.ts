// Date arithmetic helpers that return canonical YYYY-MM-DD strings, so callers
// in the study challenge catalog can compose relative prompt targets without
// reaching for a date library. All helpers copy the input Date (never mutate)
// and interpret fields in local time — the admin's wall clock is the anchor
// for "today" at session creation.
//
// Pass a negative `n` to subtract. Calendar-based helpers (addMonths,
// addYears) delegate to the platform's Date overflow rules: e.g. Feb 29 +
// 1 year rolls to Mar 1 on non-leap targets, which is good enough for the
// study's authored prompts.

function toPlainDateKey(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function plainDateKeyFromDate(date: Date): string {
	return toPlainDateKey(date);
}

export function addDays(base: Date, n: number): string {
	const d = new Date(base);
	d.setDate(d.getDate() + n);
	return toPlainDateKey(d);
}

export function addWeeks(base: Date, n: number): string {
	return addDays(base, n * 7);
}

export function addMonths(base: Date, n: number): string {
	const d = new Date(base);
	d.setMonth(d.getMonth() + n);
	return toPlainDateKey(d);
}

export function addYears(base: Date, n: number): string {
	const d = new Date(base);
	d.setFullYear(d.getFullYear() + n);
	return toPlainDateKey(d);
}

// Returns the next occurrence of `weekday` (0 = Sunday … 6 = Saturday)
// strictly AFTER `base`. Used for "next Monday" prompts: if base IS Monday,
// the result is the Monday of the following week, matching everyday usage.
export function nextWeekday(base: Date, weekday: number): Date {
	if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
		throw new TypeError('weekday must be an integer in [0, 6]');
	}
	const d = new Date(base);
	const diff = (weekday - d.getDay() + 7) % 7 || 7;
	d.setDate(d.getDate() + diff);
	return d;
}
