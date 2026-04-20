import { STUDY_PICKERS } from '$lib/components/date-picker-study/pickers/catalog';

// Map a stable picker_id (hot_date) to its custom-element tag (hot-date).
// Custom-element names require a hyphen; picker_ids are snake_case, so
// replacing underscores yields a valid tag that matches each packaged
// picker's natural name. Picker packages (e.g. @stolinski/hot-date,
// @wesbos/date-range-picker) self-register under that same tag on import,
// so our derived tag composes directly with the package's own registration
// — no extra subclassing required.
//
// The mapping is derived from STUDY_PICKERS rather than hand-maintained so
// adding a fourth picker (unlikely given the within-subject design, but
// possible) automatically gets a tag without a drift point.
export function getPickerTagForId(pickerId: string): string {
	const picker = STUDY_PICKERS.find((entry) => entry.id === pickerId);
	if (!picker) {
		throw new Error(`unknown picker_id "${pickerId}"`);
	}
	return picker.id.replace(/_/g, '-');
}

// Contract every picker web component must satisfy to work with the
// challenge runner:
//
// 1. Registered as a custom element whose tag is `getPickerTagForId(id)`.
// 2. Renders its value-entry UI as direct DOM children (or shadow DOM with
//    composed events). No portals / body-attached popovers — the wrapper-
//    scoped click/keypress listeners won't see interactions outside the
//    wrapper (spec §8.5).
// 3. Exposes a string `value` property and fires `input`, `change`, or
//    `value-commit` (bubbles + composed) when that value updates. See
//    engine/picker-protocol.ts for the full property/event contract.
//
// This interface is documentation-only — TypeScript can't enforce that an
// HTMLElement subclass dispatches a specific event. Adapter tests (and the
// placeholder's own unit behavior) carry the real guarantee.
export type StudyPickerAdapter = HTMLElement;
