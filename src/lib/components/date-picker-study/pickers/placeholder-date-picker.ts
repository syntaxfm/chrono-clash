// Placeholder picker for use while the real picker implementations are
// still in development. Wraps two native <input type="date"> elements so
// the participant flow can be exercised end-to-end for both single-date
// and range challenges (spec §7 / schema.ts STUDY_TARGET_VALUE_REGEX).
//
// Real picker web components will replace this class tag-by-tag (see
// pickers/register.ts). The contract they must satisfy is documented in
// engine/picker-protocol.ts: a `value: string` property and standard
// `input`/`change` events. The inner inputs' native events bubble up to
// the wrapper unchanged; the `value` getter composes the two input values
// into the study target shape expected by normalizeStudyTargetValue:
//   - both filled  → "YYYY-MM-DD/YYYY-MM-DD"
//   - only start   → "YYYY-MM-DD"
//   - only end     → "YYYY-MM-DD"
//   - neither      → ""
// The single-input shape for single-date targets means the participant
// doesn't have to touch the second field when the challenge is a plain
// date; the range shape kicks in automatically once both are set.
export class PlaceholderDatePicker extends HTMLElement {
	#startInput: HTMLInputElement | undefined;
	#endInput: HTMLInputElement | undefined;

	get value(): string {
		const start = this.#startInput?.value ?? '';
		const end = this.#endInput?.value ?? '';
		if (start && end) return `${start}/${end}`;
		return start || end;
	}

	set value(next: string) {
		const [start = '', end = ''] = next.split('/');
		if (this.#startInput) this.#startInput.value = start;
		if (this.#endInput) this.#endInput.value = end;
	}

	connectedCallback(): void {
		if (this.#startInput) return;
		const start = document.createElement('input');
		start.type = 'date';
		const end = document.createElement('input');
		end.type = 'date';
		this.appendChild(start);
		this.appendChild(end);
		this.#startInput = start;
		this.#endInput = end;
	}

	disconnectedCallback(): void {
		this.#startInput = undefined;
		this.#endInput = undefined;
	}
}
