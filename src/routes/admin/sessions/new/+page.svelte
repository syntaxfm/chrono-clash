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

<a class="back" href={resolve('/admin')}
	><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
		><title>arrow-bold-left</title><g fill="currentColor"
			><path
				d="M15.25 5.99995H9.99997V4.00695C9.99997 3.52895 9.73397 3.09995 9.30597 2.88695C8.87897 2.67495 8.37597 2.72195 7.99497 3.01095L1.41397 8.00395C1.09997 8.24195 0.919983 8.60495 0.919983 8.99995C0.919983 9.39495 1.09997 9.75695 1.41397 9.99595L7.99497 14.9889C8.21797 15.1579 8.48196 15.2439 8.74896 15.2439C8.93696 15.2439 9.12897 15.2009 9.30597 15.1129C9.73497 14.8999 9.99997 14.4709 9.99997 13.9929V11.9999H15.25C16.215 11.9999 17 11.2149 17 10.2499V7.74995C17 6.78495 16.215 5.99995 15.25 5.99995Z"
				fill-opacity="0.4"
			></path></g
		></svg
	>Back</a
>

<h1>New session</h1>

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

<style>
	label {
		text-align: left;
	}
</style>
