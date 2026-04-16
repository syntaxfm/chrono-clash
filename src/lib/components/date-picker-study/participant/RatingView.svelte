<script lang="ts">
	import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();

	const round = $derived(session.rounds[session.current_round_index]);
</script>

{#if round}
	<h1>Rate {round.picker_label}</h1>
{/if}
