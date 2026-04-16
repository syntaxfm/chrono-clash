import { STUDY_PICKERS } from '$lib/components/date-picker-study/pickers/catalog';

// Map a stable picker_id (input_a) to a valid custom-element tag
// (study-input-a). Custom-element names require a hyphen; we namespace under
// `study-` so app-level custom elements can never collide with picker tags.
//
// The mapping is derived from STUDY_PICKERS rather than hand-maintained so
// adding a fourth picker (unlikely given the within-subject design, but
// possible) automatically gets a tag without a drift point.
export function getPickerTagForId(pickerId: string): string {
	const picker = STUDY_PICKERS.find((entry) => entry.id === pickerId);
	if (!picker) {
		throw new Error(`unknown picker_id "${pickerId}"`);
	}
	return `study-${picker.id.replace(/_/g, '-')}`;
}

// Contract every picker web component must satisfy to work with the
// challenge runner:
//
// 1. Registered as a custom element whose tag is `getPickerTagForId(id)`.
// 2. Renders its value-entry UI as direct DOM children (or shadow DOM with
//    composed events). No portals / body-attached popovers — the wrapper-
//    scoped click/keypress listeners won't see interactions outside the
//    wrapper (spec §8.5).
// 3. Dispatches the study-picker-change CustomEvent (see picker-protocol.ts)
//    with { bubbles: true, composed: true } on every candidate value the
//    participant produces. Cadence is adapter's choice.
//
// This interface is documentation-only — TypeScript can't enforce that an
// HTMLElement subclass dispatches a specific event. Adapter tests (and the
// placeholder's own unit behavior) carry the real guarantee.
export type StudyPickerAdapter = HTMLElement;
