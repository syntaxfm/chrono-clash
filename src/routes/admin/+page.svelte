<script lang="ts">
	import { resolve } from '$app/paths';
	import { AccountCoState } from 'jazz-tools/svelte';

	import {
		countCompletedRounds,
		countCompletedRuns,
		countTotalRuns
	} from '$lib/components/date-picker-study/admin-workspace';
	import { RATE_DATE_ACCOUNT_RESOLVE, RateDateAccount } from '$lib/schema';

	const me = new AccountCoState(RateDateAccount, { resolve: RATE_DATE_ACCOUNT_RESOLVE });
</script>

<header>
	<h1>Sessions</h1>
	<a class="button success" href={resolve('/admin/sessions/new')}>New session</a>
</header>

{#if !me.current?.$isLoaded}
	<p>Loading…</p>
{:else if me.current.root.study_session_index.sessions.length === 0}
	<p>No sessions yet.</p>
{:else}
	<ul>
		{#each me.current.root.study_session_index.sessions as session (session?.$jazz.id)}
			{#if session}
				<li>
					<a href={resolve('/admin/sessions/[sessionId]', { sessionId: session.$jazz.id })}>
						<span>{session.participant_first_name ?? 'Unassigned participant'}</span>
						<span>{session.status}</span>
						<span>{countCompletedRounds(session)} / {session.rounds.length} rounds</span>
						<span>{countCompletedRuns(session)} / {countTotalRuns(session)} challenges</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
