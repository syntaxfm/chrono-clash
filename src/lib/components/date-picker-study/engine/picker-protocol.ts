// Contract between picker web components and the challenge runner.
//
// The runner reads the picker's `value` property (string, YYYY-MM-DD or
// loosely formatted — normalized downstream by date-normalization.ts). It
// knows to re-read by listening for the standard `input` and `change` DOM
// events on the wrapper element; any installed form-like web component
// fires one or both already, so no custom event name or detail payload is
// required.
//
// Why read the property instead of an event detail: property-backed web
// components are the norm (native <input>, @github elements, shoelace,
// open-wc form controls, etc.). Reading `element.value` on a standard
// event matches how any consumer of those libraries would integrate them,
// and lets us drop installed components in with zero adapter code in the
// common case.
//
// Requirements on picker implementations:
//   - Expose a `value: string` property reflecting the current selection.
//   - Fire `input` and/or `change` DOM events when the value changes.
//   - Events should bubble (default for these event types). If the picker
//     uses shadow DOM, ensure the events are dispatched with
//     `composed: true` so they cross the shadow boundary; all standard
//     UI events are composed by default.
//   - Keep the UI (including popovers) inside the host element — see
//     spec §8.5. Portal-to-body popovers escape the wrapper-scoped
//     click/keypress listeners.
export interface StudyPickerElement extends HTMLElement {
	value: string;
}
