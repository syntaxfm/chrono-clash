<script lang="ts">
	import { untrack } from 'svelte';

	import {
		CHALLENGE_CONFIRMATION_DELAY_MS,
		advanceAfterCorrectChallenge,
		completeRun,
		markRunShown,
		startRoundIfPending
	} from '$lib/components/date-picker-study/engine/progression';
	import {
		STUDY_PICKER_CHANGE_EVENT,
		type StudyPickerChangeDetail
	} from '$lib/components/date-picker-study/engine/picker-protocol';
	import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';
	import { normalizePlainDateKey } from '$lib/utils/date-normalization';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();

	// Reads straight from Jazz so reload/resume lands on the exact active
	// challenge without any parallel local pointer to reconcile.
	const round = $derived(session.rounds[session.current_round_index]);
	const run = $derived(round?.runs[round.current_challenge_index]);

	let wrapperEl = $state<HTMLElement | undefined>(undefined);

	// Round lifecycle: flip pending → in_progress the first time the runner
	// renders for this round. Guarded inside startRoundIfPending, so it's a
	// no-op on re-render or on rounds already past pending.
	$effect(() => {
		if (!round) return;
		untrack(() => startRoundIfPending(round, Date.now()));
	});

	// Per-run setup + listeners. Re-runs when `run` identity changes (next
	// challenge in the round) so each challenge gets its own timer start,
	// its own attempted-set, and its own listener lifetime.
	$effect(() => {
		const activeRun = run;
		const el = wrapperEl;
		if (!activeRun || !el) return;

		untrack(() => markRunShown(activeRun, Date.now()));

		// Tracks distinct emissions before a correct one (spec §5). Set-based
		// so noisy live-binding pickers that repeat the same partial value on
		// every keystroke only count once. Not reactive — only read inside
		// the event handlers below.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const attemptedValues = new Set<string>();

		function onPickerChange(event: CustomEvent<StudyPickerChangeDetail>) {
			if (activeRun.is_correct) return;
			const normalized = normalizePlainDateKey(event.detail.value);
			if (normalized === null) return;

			if (normalized === activeRun.target_date_iso) {
				const now = Date.now();
				completeRun(activeRun, normalized, now);
				window.setTimeout(() => {
					advanceAfterCorrectChallenge(session, Date.now());
				}, CHALLENGE_CONFIRMATION_DELAY_MS);
				return;
			}

			if (attemptedValues.has(normalized)) return;
			attemptedValues.add(normalized);
			activeRun.$jazz.set('attempt_count', (activeRun.attempt_count ?? 0) + 1);
		}

		function onWrapperClick() {
			if (activeRun.is_correct) return;
			activeRun.$jazz.set('click_count', (activeRun.click_count ?? 0) + 1);
		}

		function onWrapperKeydown(event: KeyboardEvent) {
			if (activeRun.is_correct) return;
			// Pure modifier keys shouldn't inflate keypress_count — a participant
			// holding shift while picking a range would otherwise pay a keypress
			// per Shift repeat (spec §8.5).
			if (
				event.key === 'Shift' ||
				event.key === 'Control' ||
				event.key === 'Alt' ||
				event.key === 'Meta'
			) {
				return;
			}
			activeRun.$jazz.set('keypress_count', (activeRun.keypress_count ?? 0) + 1);
		}

		el.addEventListener(STUDY_PICKER_CHANGE_EVENT, onPickerChange);
		el.addEventListener('click', onWrapperClick);
		el.addEventListener('keydown', onWrapperKeydown);

		return () => {
			el.removeEventListener(STUDY_PICKER_CHANGE_EVENT, onPickerChange);
			el.removeEventListener('click', onWrapperClick);
			el.removeEventListener('keydown', onWrapperKeydown);
		};
	});
</script>

{#if round && run}
	<p>{round.current_challenge_index + 1} / {round.runs.length}</p>
	<h1>{run.prompt_text}</h1>
	<div bind:this={wrapperEl} data-study-picker-wrapper data-picker-id={round.picker_id}></div>
	{#if run.is_correct}
		<p role="status">Got it</p>
	{/if}
{/if}
