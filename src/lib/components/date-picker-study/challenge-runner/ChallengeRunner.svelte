<script lang="ts">
	import { untrack } from 'svelte';

	import { pickCongrats } from '$lib/components/date-picker-study/challenge-runner/congrats';
	import type { StudyPickerElement } from '$lib/components/date-picker-study/engine/picker-protocol';
	import {
		CHALLENGE_CONFIRMATION_DELAY_MS,
		advanceAfterCorrectChallenge,
		completeRun,
		markRunShown,
		startRoundIfPending
	} from '$lib/components/date-picker-study/engine/progression';
	import { emitChallengeResolved } from '$lib/components/date-picker-study/metrics/emit';
	import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';
	import { getPickerTagForId } from '$lib/components/date-picker-study/pickers/adapter';
	import '$lib/components/date-picker-study/pickers/register';
	import { normalizeStudyTargetValue } from '$lib/utils/date-normalization';
	import { fly } from 'svelte/transition';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();

	// Reads straight from Jazz so reload/resume lands on the exact active
	// challenge without any parallel local pointer to reconcile.
	const round = $derived(session.rounds[session.current_round_index]);
	const run = $derived(round?.runs[round.current_challenge_index]);
	// Deterministic per-run so the message is stable while the banner is
	// visible but varies across challenges.
	const congratsMessage = $derived(run ? pickCongrats(run.$jazz.id) : '');

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

		// Tracks distinct values seen before a correct one (spec §5). Pickers
		// that fire both `input` and `change` with the same value only count
		// as one attempt thanks to this set. Not reactive — only read inside
		// the event handlers below.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const attemptedValues = new Set<string>();

		const pickerTag = getPickerTagForId(round!.picker_id);
		const wrapper: HTMLElement = el;

		function onPickerValueChange() {
			if (activeRun.is_correct) return;
			// Re-query the picker element every event because {#key} may
			// replace it between runs. Reads the standard `value` property
			// (spec §5 + engine/picker-protocol.ts) rather than an event
			// payload so any form-like web component fits without an adapter.
			const pickerEl = wrapper.querySelector<StudyPickerElement>(pickerTag);
			if (!pickerEl) return;
			const raw = pickerEl.value;
			if (typeof raw !== 'string' || raw.length === 0) return;
			const normalized = normalizeStudyTargetValue(raw);
			if (normalized === null) return;

			if (normalized === activeRun.target_date_iso) {
				const now = Date.now();
				completeRun(activeRun, normalized, now);
				// Snapshot the round index BEFORE the delayed advance so the
				// metric's input_round_index reflects the round this challenge
				// belonged to, not the one the engine has already advanced to.
				emitChallengeResolved(session, session.current_round_index, activeRun);
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

		// Listen for the set of commit-signal events any conforming picker
		// may fire: `input` (live-binding), `change` (native commit pickers),
		// and `value-commit` (custom-element pickers that only expose a
		// committed value on an explicit commit, e.g. hot-date). Same
		// handler for all; dupes with identical values are filtered by the
		// attemptedValues set.
		const changeEvents = ['input', 'change', 'value-commit'] as const;
		for (const name of changeEvents) el.addEventListener(name, onPickerValueChange);
		el.addEventListener('click', onWrapperClick);
		el.addEventListener('keydown', onWrapperKeydown);

		return () => {
			for (const name of changeEvents) el.removeEventListener(name, onPickerValueChange);
			el.removeEventListener('click', onWrapperClick);
			el.removeEventListener('keydown', onWrapperKeydown);
		};
	});
</script>

{#if round && run}
	<p class="center">{round.current_challenge_index + 1} / {round.runs.length}</p>
	<h1>{run.prompt_text}</h1>
	<div bind:this={wrapperEl} data-study-picker-wrapper data-picker-id={round.picker_id}>
		{#key run.$jazz.id}
			<svelte:element this={getPickerTagForId(round.picker_id)} />
		{/key}
	</div>
	{#if run.is_correct}
		<p class="status" transition:fly={{ y: 20, opacity: 0 }} role="status">{congratsMessage}</p>
	{/if}
{/if}

<style>
	h1 {
		margin-bottom: var(--vs-xl);
	}

	.status {
		text-align: center;
	}
</style>
