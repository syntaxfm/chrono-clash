<script lang="ts">
	import { AccountCoState } from 'jazz-tools/svelte';

	import {
		EXPORT_FORMAT_VERSION,
		exportSession,
		importSession,
		type ExportedStudy
	} from '$lib/components/date-picker-study/export';
	import { RateDateAccount, RATE_DATE_ACCOUNT_RESOLVE } from '$lib/schema';

	const me = new AccountCoState(RateDateAccount, { resolve: RATE_DATE_ACCOUNT_RESOLVE });

	let exportState = $state<'idle' | 'exporting' | 'done'>('idle');
	let lastExportCount = $state<number | null>(null);

	let importText = $state('');
	let importState = $state<'idle' | 'importing' | 'done' | 'error'>('idle');
	let importError = $state<string | null>(null);
	let importedCount = $state<number>(0);

	async function runExport() {
		if (!me.current?.$isLoaded) return;
		const index = me.current.root?.study_session_index;
		if (!index?.$isLoaded) return;

		exportState = 'exporting';

		const exported: ExportedStudy = {
			export_format_version: EXPORT_FORMAT_VERSION,
			exported_at_ms: Date.now(),
			session_count: 0,
			sessions: []
		};

		for (const session of index.sessions ?? []) {
			if (!session?.$isLoaded) continue;
			exported.sessions.push(exportSession(session));
		}
		exported.session_count = exported.sessions.length;

		const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		const stamp = new Date().toISOString().replace(/[:.]/g, '-');
		link.href = url;
		link.download = `rate-date-sessions-${stamp}.json`;
		link.click();
		URL.revokeObjectURL(url);

		lastExportCount = exported.session_count;
		exportState = 'done';
	}

	async function onFilePicked(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		importText = await file.text();
		input.value = '';
	}

	async function runImport() {
		if (!me.current?.$isLoaded) return;
		const index = me.current.root?.study_session_index;
		if (!index?.$isLoaded) {
			importError = 'Current account has no study_session_index to import into';
			importState = 'error';
			return;
		}

		importState = 'importing';
		importError = null;
		importedCount = 0;

		try {
			const parsed = JSON.parse(importText) as ExportedStudy;
			if (parsed.export_format_version !== EXPORT_FORMAT_VERSION) {
				throw new Error(
					`Unsupported export_format_version ${parsed.export_format_version} (expected ${EXPORT_FORMAT_VERSION})`
				);
			}
			if (!Array.isArray(parsed.sessions)) {
				throw new Error('sessions is not an array');
			}

			const list = index.sessions;
			if (!list?.$isLoaded) throw new Error('sessions list not loaded');

			for (const record of parsed.sessions) {
				const session = importSession(record);
				list.$jazz.push(session);
				importedCount += 1;
			}

			importState = 'done';
		} catch (err) {
			importError = err instanceof Error ? err.message : String(err);
			importState = 'error';
		}
	}
</script>

<header>
	<h1>Data</h1>
</header>

<div class="stack">
	{#if !me.current?.$isLoaded || !me.current.root?.$isLoaded || !me.current.root.study_session_index?.$isLoaded}
		<p>Loading…</p>
	{:else}
		{@const sessions = me.current.root.study_session_index.sessions ?? []}

		<section>
			<h2>Export</h2>
			<p>
				Downloads a JSON snapshot of every session currently in your index. Keep this file —
				it's a reliable backup independent of any sync state.
			</p>
			<p><strong>{sessions.length} sessions</strong> available to export.</p>
			<button type="button" onclick={runExport} disabled={exportState === 'exporting'}>
				{exportState === 'exporting' ? 'Exporting…' : 'Download JSON'}
			</button>
			{#if lastExportCount !== null}
				<p class="done">Exported {lastExportCount} sessions.</p>
			{/if}
		</section>

		<section>
			<h2>Import</h2>
			<p>
				Recreates every session in the uploaded JSON and appends them to your index. Each
				imported session gets a fresh CoValue id and a new public-writable group (so
				participant URLs will change). Participant-entered data (timings, ratings, final
				values) is preserved exactly.
			</p>
			<input type="file" accept="application/json,.json" onchange={onFilePicked} />
			<textarea
				rows="8"
				bind:value={importText}
				placeholder="…or paste exported JSON here"
				spellcheck="false"
			></textarea>
			<button
				type="button"
				onclick={runImport}
				disabled={importState === 'importing' || !importText.trim()}
			>
				{importState === 'importing' ? `Importing… ${importedCount}` : 'Import'}
			</button>
			{#if importState === 'done'}
				<p class="done">Imported {importedCount} sessions.</p>
			{/if}
			{#if importError}
				<p class="error">Import error: {importError}</p>
			{/if}
		</section>
	{/if}
</div>

<style>
	section {
		display: grid;
		gap: var(--vs-sm);
		padding: var(--vs-md) 0;
		border-bottom: 1px solid var(--c-border);
	}
	textarea {
		width: 100%;
		font-family: monospace;
		font-size: 0.85em;
	}
	.error {
		color: var(--c-error, crimson);
	}
	.done {
		color: var(--c-success, green);
	}
</style>
