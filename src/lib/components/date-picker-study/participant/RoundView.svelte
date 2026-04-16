<script lang="ts">
	import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();

	// Reads straight from Jazz — no derived mirror state that could diverge
	// from session truth on reload/resume.
	const round = $derived(session.rounds[session.current_round_index]);
	const run = $derived(round?.runs[round.current_challenge_index]);
</script>

{#if round && run}
	<p>{round.current_challenge_index + 1} / {round.runs.length}</p>
	<h1>{run.prompt_text}</h1>
{/if}
