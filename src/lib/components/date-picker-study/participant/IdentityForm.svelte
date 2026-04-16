<script lang="ts">
	import {
		startParticipantSession,
		type LoadedParticipantSession
	} from '$lib/components/date-picker-study/participant/start-session';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();

	let participantId = $state('');
	let participantFirstName = $state('');
	let errorMessage = $state<string | null>(null);
	let isStarting = $state(false);

	function start(event: SubmitEvent) {
		event.preventDefault();
		if (isStarting) return;
		isStarting = true;
		errorMessage = null;
		try {
			startParticipantSession(session, { participantId, participantFirstName });
		} catch (error) {
			isStarting = false;
			errorMessage = error instanceof Error ? error.message : 'Could not start session.';
		}
	}
</script>

<form onsubmit={start}>
	<label>
		Participant ID
		<input
			type="text"
			autocomplete="off"
			required
			bind:value={participantId}
			disabled={isStarting}
		/>
	</label>
	<label>
		Name
		<input
			type="text"
			autocomplete="given-name"
			required
			bind:value={participantFirstName}
			disabled={isStarting}
		/>
	</label>
	<button type="submit" disabled={isStarting}>
		{isStarting ? 'Starting…' : 'Start'}
	</button>
</form>

{#if errorMessage}
	<p role="alert">{errorMessage}</p>
{/if}
