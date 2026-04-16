<script lang="ts">
	import type { LoadedParticipantSession } from '$lib/components/date-picker-study/participant/start-session';

	type Props = {
		session: LoadedParticipantSession;
	};

	let { session }: Props = $props();
</script>

<h1>Thanks, {session.participant_first_name ?? 'friend'}.</h1>
<p>The study is complete.</p>
