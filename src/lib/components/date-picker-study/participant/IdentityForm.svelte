<script lang="ts">
	import {
		startParticipantSession,
		type LoadedParticipantSession
	} from '$lib/components/date-picker-study/participant/start-session';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();

	let participantFirstName = $state('');
	let errorMessage = $state<string | null>(null);
	let isStarting = $state(false);

	function start(event: SubmitEvent) {
		event.preventDefault();
		console.log(isStarting);
		console.log(participantFirstName);
		if (isStarting) return;
		isStarting = true;
		errorMessage = null;
		try {
			startParticipantSession(session, { participantFirstName });
		} catch (error) {
			isStarting = false;
			errorMessage = error instanceof Error ? error.message : 'Could not start session.';
		}
	}
</script>

<div class="readable">
	<h1>Hi {participantFirstName}, thank you <br /> for joining our study.</h1>
	<p class="center">Once you hit start, the session will begin.</p>

	<form onsubmit={start} class="stack">
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
		<button
			class="big-boi success"
			type="submit"
			disabled={isStarting}
			style="margin: 0 auto; display: block;"
		>
			{isStarting ? 'Starting…' : 'Start'}
		</button>
	</form>

	{#if errorMessage}
		<p role="alert">{errorMessage}</p>
	{/if}
</div>

<style>
	.readable {
		margin: 0 auto;
	}
</style>
