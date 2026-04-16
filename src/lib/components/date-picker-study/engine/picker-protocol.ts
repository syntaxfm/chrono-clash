// Contract between picker adapters (re77y6p1) and the challenge runner.
//
// Why a DOM CustomEvent and not a prop/callback: the three pickers are web
// components (spec §5), so the boundary between adapter and runner crosses
// a shadow DOM. `composed: true` bubbling events are the one signal that
// reliably crosses shadow roots and whose `target` resolves to the host
// element (which is inside the wrapper) from the outside. Callbacks through
// props would require each adapter to plumb the prop through shadow DOM,
// which the spec explicitly sidesteps.
//
// Adapters MUST dispatch with { bubbles: true, composed: true } or the
// runner will never see the event.
export const STUDY_PICKER_CHANGE_EVENT = 'study-picker-change';

export type StudyPickerChangeDetail = {
	// Emitted as-is from the adapter; may be loosely formatted (e.g.
	// "2026-1-5"). The runner normalizes via date-normalization.ts before
	// comparing to the challenge target.
	value: string;
};

// Module augmentation so TS knows the custom event on HTMLElement. Adapters
// dispatch `new CustomEvent<StudyPickerChangeDetail>(...)` and the runner
// addEventListener(STUDY_PICKER_CHANGE_EVENT, handler) gets a typed event.
declare global {
	interface HTMLElementEventMap {
		[STUDY_PICKER_CHANGE_EVENT]: CustomEvent<StudyPickerChangeDetail>;
	}
}
