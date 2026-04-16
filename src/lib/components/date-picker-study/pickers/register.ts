import { browser } from '$app/environment';

// Browser-only registration of the placeholder picker under every
// STUDY_PICKERS tag. Dynamic imports keep the DOM-dependent
// placeholder-date-picker module out of the server bundle — its class
// declaration references HTMLElement at module scope, which doesn't exist
// during SSR.
//
// Fire-and-forget: the import resolves before any picker tag is rendered
// because ChallengeRunner's $effect (which reads the tag name) only runs
// client-side after hydration, and module evaluation order guarantees this
// side effect dispatches before component mount.
async function registerPlaceholderPickers(): Promise<void> {
	const [{ STUDY_PICKERS }, { getPickerTagForId }, { PlaceholderDatePicker }] = await Promise.all([
		import('$lib/components/date-picker-study/pickers/catalog'),
		import('$lib/components/date-picker-study/pickers/adapter'),
		import('$lib/components/date-picker-study/pickers/placeholder-date-picker')
	]);

	for (const picker of STUDY_PICKERS) {
		const tag = getPickerTagForId(picker.id);
		if (customElements.get(tag)) continue;
		// Fresh subclass per tag — customElements.define rejects the same
		// constructor being bound to multiple tags.
		customElements.define(tag, class extends PlaceholderDatePicker {});
	}
}

if (browser) {
	void registerPlaceholderPickers();
}
