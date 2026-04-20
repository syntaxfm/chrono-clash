import { browser } from '$app/environment';

// Browser-only registration of picker web components under every
// STUDY_PICKERS tag. Dynamic imports keep the DOM-dependent picker modules
// out of the server bundle — their class declarations reference HTMLElement
// at module scope, which doesn't exist during SSR.
//
// Fire-and-forget: the import resolves before any picker tag is rendered
// because ChallengeRunner's $effect (which reads the tag name) only runs
// client-side after hydration, and module evaluation order guarantees this
// side effect dispatches before component mount.

// Real picker packages register their custom-element tag as a side effect of
// being imported (customElements.define runs at module top level). We load
// them via dynamic import so SSR never touches DOM APIs, and because each
// package's self-registered tag matches the tag we derive in adapter.ts no
// subclassing is needed — `customElements.whenDefined(tag)` just confirms the
// registration before the runner mounts the tag.
const SELF_REGISTERING_PICKER_MODULES: Record<string, () => Promise<unknown>> = {
	hot_date: () => import('@stolinski/hot-date'),
	date_range_picker: () => import('@wesbos/date-range-picker'),
	magic_date_picker: () => import('@w3cj/magic-date-picker/bundled')
};

async function registerStudyPickers(): Promise<void> {
	const [{ STUDY_PICKERS }, { getPickerTagForId }, { PlaceholderDatePicker }] = await Promise.all([
		import('$lib/components/date-picker-study/pickers/catalog'),
		import('$lib/components/date-picker-study/pickers/adapter'),
		import('$lib/components/date-picker-study/pickers/placeholder-date-picker')
	]);

	for (const picker of STUDY_PICKERS) {
		const tag = getPickerTagForId(picker.id);
		if (customElements.get(tag)) continue;

		const loader = SELF_REGISTERING_PICKER_MODULES[picker.id];
		if (loader) {
			await loader();
			await customElements.whenDefined(tag);
			continue;
		}

		// Fresh subclass per tag — customElements.define rejects the same
		// constructor being bound to multiple tags.
		customElements.define(tag, class extends PlaceholderDatePicker {});
	}
}

if (browser) {
	registerStudyPickers().catch((error) => {
		console.error('failed to register study pickers', error);
	});
}
