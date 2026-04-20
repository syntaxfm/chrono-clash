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
	<h1>Session</h1>
	<nav>
		<a href={resolve('/admin')}>Sessions</a>
		<a href={resolve('/admin/leaderboard')}>Leaderboard</a>
		<a href={resolve('/admin/data')}>Data</a>
	</nav>
</header>

<div class="stack">
	<div>
		<a class="button success" href={resolve('/admin/sessions/new')}>New session</a>
	</div>
	{#if !me.current?.$isLoaded}
		<p>Loading…</p>
	{:else if me.current.root.study_session_index.sessions.length === 0}
		<p>No sessions yet.</p>
	{:else}
		<div class="table">
			<table>
				<thead>
					<tr>
						<th scope="col">Participant</th>
						<th scope="col">Status</th>
						<th scope="col">Rounds</th>
						<th scope="col">Challenges</th>
					</tr>
				</thead>
				<tbody>
					{#each me.current.root.study_session_index.sessions as session (session?.$jazz.id)}
						{#if session}
							<tr>
								<td>
									<a href={resolve('/admin/sessions/[sessionId]', { sessionId: session.$jazz.id })}>
										{session.participant_first_name ?? 'Unassigned participant'}
									</a>
								</td>
								<td>{session.status}</td>
								<td>{countCompletedRounds(session)} / {session.rounds.length}</td>
								<td>{countCompletedRuns(session)} / {countTotalRuns(session)}</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	nav {
		display: flex;
		gap: 20px;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--vs-xl);
	}
</style>
