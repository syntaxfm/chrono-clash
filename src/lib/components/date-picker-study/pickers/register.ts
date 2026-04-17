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

// Picker bundles that ship as self-contained scripts and are loaded from
// /static instead of imported. This is required for bundles Vite's parser
// can't process (e.g. certain minifier outputs). The bundle's <script
// type="module"> execution is what calls customElements.define(tag, ...),
// so after the script loads we just wait for `whenDefined` on the study
// tag — no subclassing needed.
const EXTERNAL_PICKER_BUNDLES: Record<string, string> = {
	hot_date: '/pickers/hot-date.js'
};

async function loadExternalPickerBundle(src: string): Promise<void> {
	const existing = document.querySelector<HTMLScriptElement>(`script[data-picker-bundle="${src}"]`);
	if (existing) {
		if (existing.dataset.loaded === 'true') return;
		await new Promise<void>((resolve, reject) => {
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener('error', () => reject(new Error(`failed to load ${src}`)), {
				once: true
			});
		});
		return;
	}
	await new Promise<void>((resolve, reject) => {
		const script = document.createElement('script');
		script.type = 'module';
		script.src = src;
		script.dataset.pickerBundle = src;
		script.addEventListener(
			'load',
			() => {
				script.dataset.loaded = 'true';
				resolve();
			},
			{ once: true }
		);
		script.addEventListener('error', () => reject(new Error(`failed to load ${src}`)), {
			once: true
		});
		document.head.appendChild(script);
	});
}

async function registerStudyPickers(): Promise<void> {
	const [{ STUDY_PICKERS }, { getPickerTagForId }, { PlaceholderDatePicker }] = await Promise.all([
		import('$lib/components/date-picker-study/pickers/catalog'),
		import('$lib/components/date-picker-study/pickers/adapter'),
		import('$lib/components/date-picker-study/pickers/placeholder-date-picker')
	]);

	for (const picker of STUDY_PICKERS) {
		const tag = getPickerTagForId(picker.id);
		if (customElements.get(tag)) continue;

		const bundleSrc = EXTERNAL_PICKER_BUNDLES[picker.id];
		if (bundleSrc) {
			await loadExternalPickerBundle(bundleSrc);
			// Bundle has already called customElements.define(tag) on its
			// own; whenDefined just confirms the registration before the
			// runner mounts the tag.
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
