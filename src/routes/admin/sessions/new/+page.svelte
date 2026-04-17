<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { AccountCoState } from 'jazz-tools/svelte';

	import {
		createAdminSession,
		DEFAULT_CHALLENGES_PER_PICKER
	} from '$lib/components/date-picker-study/admin-workspace';
	import { RATE_DATE_ACCOUNT_RESOLVE, RateDateAccount } from '$lib/schema';

	const me = new AccountCoState(RateDateAccount, { resolve: RATE_DATE_ACCOUNT_RESOLVE });

	let challengesPerPicker = $state(DEFAULT_CHALLENGES_PER_PICKER);
	let errorMessage = $state<string | null>(null);
	let isCreating = $state(false);

	async function create(event: SubmitEvent) {
		event.preventDefault();
		if (isCreating) return;
		const account = me.current;
		if (!account?.$isLoaded) return;

		isCreating = true;
		errorMessage = null;
		try {
			const session = createAdminSession(account.root.study_session_index, account.$jazz.id, {
				challengesPerPicker
			});
			await goto(resolve('/admin/sessions/[sessionId]', { sessionId: session.$jazz.id }));
		} catch (error) {
			isCreating = false;
			errorMessage = error instanceof Error ? error.message : 'Failed to create session.';
		}
	}
</script>

<header>
	<h1>New session</h1>
</header>

<form onsubmit={create} class="stack readable">
	<label>
		Challenges per round
		<input type="number" min="1" max="20" step="1" required bind:value={challengesPerPicker} />
	</label>
	<div class="flex">
		<button type="submit" disabled={isCreating}>
			{isCreating ? 'Creating…' : 'Create session'}
		</button>
		<a class="button error" href={resolve('/admin')}>Cancel</a>
	</div>
</form>

{#if errorMessage}
	<p role="alert">{errorMessage}</p>
{/if}
