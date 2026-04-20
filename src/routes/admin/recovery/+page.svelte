<script lang="ts">
	import { AccountCoState } from 'jazz-tools/svelte';

	import { co } from 'jazz-tools';

	import {
		STUDY_SESSION_INDEX_RESOLVE,
		StudyChallengeRun,
		StudyInputRound,
		StudySession,
		StudySessionIndex
	} from '$lib/components/date-picker-study/schema';
	import { RateDateAccount, RateDateAccountRoot } from '$lib/schema';

	const StudySessionList = co.list(StudySession);
	const StudyRunList = co.list(StudyChallengeRun);
	const StudyRoundList = co.list(StudyInputRound);

	type Candidate = {
		id: string;
		madeAtMs: number;
		sessionCount: number | 'unreachable' | 'loading';
		firstSessionIds: string[];
		source: string;
	};

	const me = new AccountCoState(RateDateAccount, { resolve: { root: true } });

	let candidates = $state<Candidate[]>([]);
	let scanState = $state<'idle' | 'scanning' | 'done' | 'error'>('idle');
	let scanError = $state<string | null>(null);
	let restoreState = $state<'idle' | 'restoring' | 'restored' | 'error'>('idle');
	let restoreError = $state<string | null>(null);

	let manualId = $state('');
	let manualResult = $state<Candidate | null>(null);
	let manualState = $state<'idle' | 'loading' | 'done' | 'error'>('idle');
	let manualError = $state<string | null>(null);

	type ProbeResult = {
		schema: string;
		loaded: boolean;
		fields: Record<string, unknown>;
	};
	let probeId = $state<string | null>(null);
	let probeResults = $state<ProbeResult[]>([]);

	type FoundSession = {
		id: string;
		createdAtMs: number;
		status: string;
		participant: string;
		roundsCount: number;
	};

	let dbScanState = $state<'idle' | 'scanning' | 'done' | 'error'>('idle');
	let dbScanError = $state<string | null>(null);
	let dbScanProgress = $state({ checked: 0, total: 0 });
	let foundSessions = $state<FoundSession[]>([]);
	let rebuildState = $state<'idle' | 'rebuilding' | 'done' | 'error'>('idle');
	let rebuildError = $state<string | null>(null);

	type RawRow = {
		id: string;
		header: unknown;
		kind: string;
		classification?: string;
	};

	type IndexSummary = {
		id: string;
		sessionCount: number | 'unreachable' | 'loading';
		schemaVersion?: number;
		firstSessionIds: string[];
	};
	let indexSummaries = $state<IndexSummary[]>([]);
	let rawDumpState = $state<'idle' | 'loading' | 'classifying' | 'done' | 'error'>('idle');
	let rawDumpError = $state<string | null>(null);
	let coValueRows = $state<RawRow[]>([]);
	let deletedRows = $state<Array<{ coValueID: string; status?: unknown }>>([]);
	let classificationSummary = $state<Record<string, number>>({});

	function extractId(value: unknown): string | null {
		if (!value) return null;
		const maybe = value as { $jazz?: { id?: string }; id?: string };
		return maybe.$jazz?.id ?? maybe.id ?? null;
	}

	async function hydrateCandidate(candidate: Candidate): Promise<Candidate> {
		const loaded = await StudySessionIndex.load(candidate.id, {
			resolve: STUDY_SESSION_INDEX_RESOLVE
		});
		if (!loaded.$isLoaded) {
			return { ...candidate, sessionCount: 'unreachable' };
		}
		const sessions = loaded.sessions ?? [];
		return {
			...candidate,
			sessionCount: sessions.length,
			firstSessionIds: sessions
				.slice(0, 5)
				.map((s) => s?.$jazz?.id ?? '')
				.filter(Boolean)
		};
	}

	async function scan() {
		if (!me.current?.$isLoaded || !me.current.root.$isLoaded) {
			scanError = 'Account root not loaded yet';
			scanState = 'error';
			return;
		}

		scanState = 'scanning';
		scanError = null;
		candidates = [];

		try {
			const edits = me.current.root.$jazz.getEdits();
			const history = edits?.study_session_index?.all ?? [];

			const seen = new Set<string>();
			const pending: Candidate[] = [];
			for (const edit of history) {
				const id = extractId(edit.value);
				if (!id || seen.has(id)) continue;
				seen.add(id);
				pending.push({
					id,
					madeAtMs: edit.madeAt?.getTime?.() ?? 0,
					sessionCount: 'loading',
					firstSessionIds: [],
					source: 'current-root edit history'
				});
			}
			candidates = pending;

			await Promise.all(
				pending.map(async (candidate, i) => {
					candidates[i] = await hydrateCandidate(candidate);
				})
			);

			scanState = 'done';
		} catch (err) {
			scanError = err instanceof Error ? err.message : String(err);
			scanState = 'error';
		}
	}

	async function inspectManual() {
		const id = manualId.trim();
		if (!id) {
			manualError = 'Enter an id first';
			manualState = 'error';
			return;
		}
		manualState = 'loading';
		manualError = null;
		manualResult = null;
		try {
			const base: Candidate = {
				id,
				madeAtMs: 0,
				sessionCount: 'loading',
				firstSessionIds: [],
				source: 'manual entry'
			};
			manualResult = await hydrateCandidate(base);
			manualState = 'done';
		} catch (err) {
			manualError = err instanceof Error ? err.message : String(err);
			manualState = 'error';
		}
		// Always also run the full probe so CoList schemas get tried too.
		await probeAllSchemas(id);
	}

	function openJazzDb(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const req = indexedDB.open('jazz-storage');
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}

	function getAllCoValueIds(db: IDBDatabase): Promise<string[]> {
		return new Promise((resolve, reject) => {
			const tx = db.transaction('coValues', 'readonly');
			const store = tx.objectStore('coValues');
			const req = store.getAll();
			req.onsuccess = () => {
				const rows = req.result as Array<{ id: string }>;
				resolve(rows.map((r) => r.id).filter(Boolean));
			};
			req.onerror = () => reject(req.error);
		});
	}

	function getAllRows<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
		return new Promise((resolve, reject) => {
			if (!db.objectStoreNames.contains(storeName)) {
				resolve([]);
				return;
			}
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			const req = store.getAll();
			req.onsuccess = () => resolve(req.result as T[]);
			req.onerror = () => reject(req.error);
		});
	}

	function kindFromHeader(header: unknown): string {
		if (!header || typeof header !== 'object') return 'unknown';
		const h = header as { type?: string; meta?: { type?: string }; ruleset?: { type?: string } };
		const metaType = h.meta?.type;
		if (metaType) return metaType;
		if (h.ruleset?.type === 'group') return 'group';
		return h.type ?? 'unknown';
	}

	async function classifyCoMap(id: string): Promise<string> {
		// Most-specific field combinations first. Jazz load is lenient — declared
		// fields appear on the returned object even when unset — so we test
		// distinctive field VALUES, not presence.

		try {
			const r = (await StudyChallengeRun.load(id)) as { $isLoaded: boolean } & Record<
				string,
				unknown
			>;
			if (
				r.$isLoaded &&
				typeof r.run_index === 'number' &&
				typeof r.challenge_group_id === 'string' &&
				typeof r.prompt_text === 'string'
			) {
				return 'StudyChallengeRun';
			}
		} catch {
			/* continue */
		}

		try {
			const r = (await StudyInputRound.load(id)) as { $isLoaded: boolean } & Record<
				string,
				unknown
			>;
			if (
				r.$isLoaded &&
				typeof r.round_index === 'number' &&
				typeof r.picker_id === 'string' &&
				typeof r.picker_label === 'string'
			) {
				return 'StudyInputRound';
			}
		} catch {
			/* continue */
		}

		try {
			const s = (await StudySession.load(id)) as { $isLoaded: boolean } & Record<string, unknown>;
			if (
				s.$isLoaded &&
				typeof s.created_by_account_id === 'string' &&
				typeof s.current_round_index === 'number' &&
				typeof s.created_at_ms === 'number'
			) {
				return 'StudySession';
			}
		} catch {
			/* continue */
		}

		try {
			const i = (await StudySessionIndex.load(id)) as { $isLoaded: boolean } & Record<
				string,
				unknown
			>;
			// StudySessionIndex: has sessions (list) + schema_version, but NOT
			// created_by_account_id (that would make it a StudySession).
			if (
				i.$isLoaded &&
				typeof i.schema_version === 'number' &&
				i.sessions &&
				typeof i.sessions === 'object' &&
				typeof (i as { created_by_account_id?: unknown }).created_by_account_id !== 'string'
			) {
				return 'StudySessionIndex';
			}
		} catch {
			/* continue */
		}

		try {
			const r = (await RateDateAccountRoot.load(id)) as { $isLoaded: boolean } & Record<
				string,
				unknown
			>;
			// Only a real root has study_session_index set to an actual CoValue.
			if (
				r.$isLoaded &&
				r.study_session_index &&
				typeof r.study_session_index === 'object' &&
				'$jazz' in r.study_session_index
			) {
				return 'RateDateAccountRoot';
			}
		} catch {
			/* continue */
		}

		return 'other-comap';
	}

	async function classifyCoList(id: string): Promise<string> {
		try {
			const asSessions = (await StudySessionList.load(id)) as {
				$isLoaded: boolean;
				length?: number;
				0?: { $jazz?: { id?: string } };
			};
			if (asSessions.$isLoaded) {
				const first = asSessions[0];
				if (first && typeof first === 'object' && '$jazz' in first) {
					const firstId = first?.$jazz?.id;
					if (firstId) {
						const sess = (await StudySession.load(firstId)) as {
							$isLoaded: boolean;
							created_by_account_id?: unknown;
						};
						if (sess.$isLoaded && typeof sess.created_by_account_id === 'string') {
							return `co.list(StudySession)[${asSessions.length ?? 0}]`;
						}
					} else if ((asSessions.length ?? 0) === 0) {
						return 'co.list(StudySession)[empty — ambiguous]';
					}
				}
			}
		} catch {
			/* continue */
		}

		try {
			const asRuns = (await StudyRunList.load(id)) as { $isLoaded: boolean; length?: number };
			if (asRuns.$isLoaded) return `co.list(StudyChallengeRun)[${asRuns.length ?? 0}]`;
		} catch {
			/* continue */
		}

		try {
			const asRounds = (await StudyRoundList.load(id)) as { $isLoaded: boolean; length?: number };
			if (asRounds.$isLoaded) return `co.list(StudyInputRound)[${asRounds.length ?? 0}]`;
		} catch {
			/* continue */
		}

		return 'other-colist';
	}

	async function classifyAsSchema(id: string, kind: string): Promise<string> {
		if (kind === 'colist') return classifyCoList(id);
		return classifyCoMap(id);
	}

	async function dumpRawDb() {
		rawDumpState = 'loading';
		rawDumpError = null;
		classificationSummary = {};
		try {
			const db = await openJazzDb();
			const covs = await getAllRows<{ id: string; header: unknown }>(db, 'coValues');
			const dels = await getAllRows<{ coValueID: string; status?: unknown }>(
				db,
				'deletedCoValues'
			);

			const rows: RawRow[] = covs.map((r) => ({
				id: r.id,
				header: r.header,
				kind: kindFromHeader(r.header)
			}));
			coValueRows = rows;
			deletedRows = dels;

			rawDumpState = 'classifying';

			for (let i = 0; i < rows.length; i += 1) {
				const row = rows[i];
				if (row.kind === 'account' || row.kind === 'profile' || row.kind === 'group') {
					row.classification = row.kind;
				} else {
					row.classification = await classifyAsSchema(row.id, row.kind);
				}
				coValueRows = [...rows];
			}

			const summary: Record<string, number> = {};
			for (const row of rows) {
				const key = row.classification ?? 'unknown';
				summary[key] = (summary[key] ?? 0) + 1;
			}
			classificationSummary = summary;

			// Deep-load every StudySessionIndex so we can show session counts.
			const indexRows = rows.filter((r) => r.classification === 'StudySessionIndex');
			const summaries: IndexSummary[] = indexRows.map((r) => ({
				id: r.id,
				sessionCount: 'loading',
				firstSessionIds: []
			}));
			indexSummaries = summaries;

			await Promise.all(
				indexRows.map(async (r, i) => {
					const loaded = await StudySessionIndex.load(r.id, {
						resolve: STUDY_SESSION_INDEX_RESOLVE
					});
					if (!loaded.$isLoaded) {
						summaries[i] = { ...summaries[i], sessionCount: 'unreachable' };
					} else {
						const sessions = loaded.sessions ?? [];
						summaries[i] = {
							id: r.id,
							schemaVersion: loaded.schema_version,
							sessionCount: sessions.length,
							firstSessionIds: sessions
								.slice(0, 5)
								.map((s) => s?.$jazz?.id ?? '')
								.filter(Boolean)
						};
					}
					indexSummaries = [...summaries];
				})
			);

			rawDumpState = 'done';
		} catch (err) {
			rawDumpError = err instanceof Error ? err.message : String(err);
			rawDumpState = 'error';
		}
	}

	// All fields across our schemas, probed by direct access.
	const ALL_FIELD_NAMES = [
		// StudySession
		'schema_version',
		'created_by_account_id',
		'created_at_ms',
		'session_index',
		'participant_id',
		'participant_first_name',
		'started_at_ms',
		'ended_at_ms',
		'status',
		'timezone',
		'locale',
		'current_round_index',
		'rounds',
		// StudyInputRound
		'round_index',
		'picker_id',
		'picker_label',
		'total_elapsed_ms',
		'average_elapsed_ms',
		'rating_design',
		'rating_ease_of_use',
		'rating_magicalness',
		'runs',
		// StudyChallengeRun
		'run_index',
		'challenge_group_id',
		'prompt_text',
		'target_date_iso',
		'shown_at_ms',
		'completed_at_ms',
		'elapsed_ms',
		'attempt_count',
		'click_count',
		'keypress_count',
		'final_value_iso',
		'is_correct',
		// StudySessionIndex
		'sessions',
		// RateDateAccountRoot
		'study_session_index'
	] as const;

	function summarizeFields(obj: unknown): Record<string, unknown> {
		if (!obj || typeof obj !== 'object') return {};
		const o = obj as Record<string, unknown>;
		const out: Record<string, unknown> = {};
		for (const key of ALL_FIELD_NAMES) {
			const v = o[key];
			if (v === undefined) continue;
			if (v === null) {
				out[key] = null;
			} else if (typeof v === 'object') {
				const j = (v as { $jazz?: { id?: string }; $isLoaded?: boolean; length?: number }).$jazz;
				const loaded = (v as { $isLoaded?: boolean }).$isLoaded;
				if (j?.id) {
					out[key] = `<ref ${j.id}${loaded === false ? ' not-loaded' : ''}>`;
				} else if (typeof (v as { length?: number }).length === 'number') {
					out[key] = `<array length=${(v as { length: number }).length}>`;
				} else {
					out[key] = '<object>';
				}
			} else {
				out[key] = v;
			}
		}
		return out;
	}

	async function probeAllSchemas(id: string) {
		probeId = id;
		probeResults = [];
		const results: ProbeResult[] = [];

		// Load once with any CoMap schema, then drop to raw to see actual stored keys.
		// CoMap shape is probed via $jazz.raw.keys() + raw.get(); that reads whatever
		// was actually persisted, ignoring which typed schema we loaded it as.
		try {
			const loaded = (await StudySession.load(id)) as {
				$isLoaded: boolean;
				$jazz?: {
					raw?: {
						keys?: () => string[];
						get?: (k: string) => unknown;
						type?: string;
					};
				};
			};
			if (loaded.$isLoaded) {
				const raw = loaded.$jazz?.raw;
				if (raw?.keys && raw.get) {
					const keys = raw.keys();
					const fields: Record<string, unknown> = {
						rawType: raw.type ?? '(unknown)',
						_keyCount: keys.length
					};
					for (const k of keys) {
						const v = raw.get(k);
						if (typeof v === 'string' && v.startsWith('co_')) {
							fields[k] = `<ref ${v}>`;
						} else {
							fields[k] = v;
						}
					}
					results.push({
						schema: 'raw CoMap keys',
						loaded: true,
						fields
					});
				}
			}
		} catch (err) {
			results.push({
				schema: 'raw CoMap keys',
				loaded: false,
				fields: { error: err instanceof Error ? err.message : String(err) }
			});
		}

		// For CoLists: load as each list schema and read items directly from raw.
		const listSchemas: Array<[string, () => Promise<unknown>]> = [
			['co.list(StudySession)', () => StudySessionList.load(id)],
			['co.list(StudyInputRound)', () => StudyRoundList.load(id)],
			['co.list(StudyChallengeRun)', () => StudyRunList.load(id)]
		];

		for (const [name, loader] of listSchemas) {
			try {
				const loaded = (await loader()) as {
					$isLoaded: boolean;
					length?: number;
					$jazz?: {
						raw?: {
							type?: string;
							asArray?: () => unknown[];
						};
					};
				};
				if (!loaded.$isLoaded) continue;
				const raw = loaded.$jazz?.raw;
				const items: unknown[] = Array.isArray(loaded)
					? (loaded as unknown[]).slice(0, 10).map((item) => {
							if (item && typeof item === 'object') {
								const j = (item as { $jazz?: { id?: string } }).$jazz;
								if (j?.id) return `<ref ${j.id}>`;
							}
							return item;
						})
					: [];
				results.push({
					schema: name,
					loaded: true,
					fields: {
						rawType: raw?.type ?? '(unknown)',
						length: loaded.length ?? 0,
						items
					}
				});
				break; // First list schema that loads is enough; item refs are the same.
			} catch {
				/* continue */
			}
		}

		probeResults = results;
	}

	function headerSummary(header: unknown): string {
		if (!header || typeof header !== 'object') return '(no header)';
		const h = header as Record<string, unknown>;
		const type = h.type;
		const meta = h.meta;
		return JSON.stringify({ type, meta });
	}

	async function scanLocalDb() {
		dbScanState = 'scanning';
		dbScanError = null;
		foundSessions = [];
		dbScanProgress = { checked: 0, total: 0 };

		try {
			const db = await openJazzDb();
			const ids = await getAllCoValueIds(db);
			dbScanProgress = { checked: 0, total: ids.length };

			const batchSize = 10;
			const found: FoundSession[] = [];
			for (let i = 0; i < ids.length; i += batchSize) {
				const batch = ids.slice(i, i + batchSize);
				await Promise.all(
					batch.map(async (id) => {
						try {
							const loaded = await StudySession.load(id);
							if (
								loaded.$isLoaded &&
								typeof loaded.created_by_account_id === 'string' &&
								typeof loaded.current_round_index === 'number'
							) {
								found.push({
									id,
									createdAtMs: loaded.created_at_ms ?? 0,
									status: loaded.status ?? '?',
									participant: loaded.participant_first_name ?? '(unassigned)',
									roundsCount: loaded.rounds?.$isLoaded ? loaded.rounds.length : -1
								});
							}
						} catch {
							/* ignore non-matching CoValues */
						}
						dbScanProgress = {
							checked: dbScanProgress.checked + 1,
							total: ids.length
						};
					})
				);
			}

			found.sort((a, b) => b.createdAtMs - a.createdAtMs);
			foundSessions = found;
			dbScanState = 'done';
		} catch (err) {
			dbScanError = err instanceof Error ? err.message : String(err);
			dbScanState = 'error';
		}
	}

	async function rebuildIndexFromScan() {
		if (!me.current?.$isLoaded || !me.current.root.$isLoaded) return;
		if (foundSessions.length === 0) return;
		rebuildState = 'rebuilding';
		rebuildError = null;
		try {
			const sessions = await Promise.all(
				foundSessions.map((s) => StudySession.load(s.id))
			);
			const loadedSessions = sessions.filter((s) => s.$isLoaded);
			if (loadedSessions.length === 0) {
				throw new Error('None of the found sessions could be loaded for rebuild');
			}
			const newIndex = StudySessionIndex.create({
				schema_version: 1,
				sessions: co.list(StudySession).create(loadedSessions)
			});
			me.current.root.$jazz.set('study_session_index', newIndex);
			rebuildState = 'done';
		} catch (err) {
			rebuildError = err instanceof Error ? err.message : String(err);
			rebuildState = 'error';
		}
	}

	async function restore(id: string) {
		if (!me.current?.$isLoaded || !me.current.root.$isLoaded) return;
		restoreState = 'restoring';
		restoreError = null;
		try {
			const loaded = await StudySessionIndex.load(id, {
				resolve: STUDY_SESSION_INDEX_RESOLVE
			});
			if (!loaded.$isLoaded) {
				throw new Error(`Could not load ${id}`);
			}
			me.current.root.$jazz.set('study_session_index', loaded);
			restoreState = 'restored';
		} catch (err) {
			restoreError = err instanceof Error ? err.message : String(err);
			restoreState = 'error';
		}
	}

	function fmtTime(ms: number): string {
		if (!ms) return '—';
		return new Date(ms).toLocaleString();
	}
</script>

<header>
	<h1>Recovery</h1>
</header>

<div class="stack">
	{#if !me.current?.$isLoaded}
		<p>Loading account…</p>
	{:else if !me.current.root.$isLoaded}
		<p>Root not loaded: {me.current.root.$jazz.loadingState}</p>
	{:else}
		<section>
			<h2>Current state</h2>
			<p><strong>Account id:</strong> <code>{me.current.$jazz.id}</code></p>
			<p><strong>Root id:</strong> <code>{me.current.root.$jazz.id}</code></p>
			<p>
				<strong>Current <code>study_session_index</code> id:</strong>
				<code>{me.current.root.study_session_index?.$jazz?.id ?? '(not set)'}</code>
			</p>

			<h3>Account raw ops (full history of every field, including past root ids)</h3>
			{#if me.current.$jazz.raw}
				{@const raw = me.current.$jazz.raw as unknown as {
					ops?: Record<string, Array<{ change?: { op?: string; key?: string; value?: unknown }; madeAt?: number }>>;
				}}
				{#if raw.ops}
					{#each Object.entries(raw.ops) as [key, ops]}
						<details open={key === 'root'}>
							<summary>
								<code>{key}</code> — {ops.length} ops
							</summary>
							<ul class="probe-fields">
								{#each ops as op, idx}
									<li>
										#{idx}
										<code>{op.change?.op ?? '?'}</code>
										{#if op.change?.value}
											= <code>{String(op.change.value)}</code>
											{#if typeof op.change.value === 'string' && op.change.value.startsWith('co_')}
												<button type="button" onclick={() => probeAllSchemas(op.change!.value as string)}>
													Chase
												</button>
											{/if}
										{/if}
										{#if op.madeAt}
											<small>at {new Date(op.madeAt).toLocaleString()}</small>
										{/if}
									</li>
								{/each}
							</ul>
						</details>
					{/each}
				{:else}
					<p><em>No raw.ops available</em></p>
				{/if}
			{/if}
		</section>

		<section>
			<h2>Scan current root's edit history</h2>
			<p>
				Reads every historical value of <code>root.study_session_index</code> on the current root
				and tries to load it.
			</p>
			<div>
				<button type="button" onclick={scan} disabled={scanState === 'scanning'}>
					{scanState === 'scanning' ? 'Scanning…' : 'Scan history'}
				</button>
			</div>
			{#if scanError}
				<p class="error">Scan error: {scanError}</p>
			{/if}

			{#if candidates.length > 0}
				<ul class="candidates">
					{#each candidates as candidate (candidate.id)}
						<li>
							<div>
								<code>{candidate.id}</code>
								<span>set at {fmtTime(candidate.madeAtMs)}</span>
								<small>from {candidate.source}</small>
							</div>
							<div>
								{#if candidate.sessionCount === 'loading'}
									loading…
								{:else if candidate.sessionCount === 'unreachable'}
									<em>unreachable from this device</em>
								{:else}
									<strong>{candidate.sessionCount} sessions</strong>
									{#if candidate.firstSessionIds.length > 0}
										<small>first: {candidate.firstSessionIds.join(', ')}</small>
									{/if}
								{/if}
							</div>
							<div>
								<button
									type="button"
									onclick={() => restore(candidate.id)}
									disabled={restoreState === 'restoring' ||
										candidate.sessionCount === 'loading' ||
										candidate.sessionCount === 'unreachable'}
								>
									Restore this one
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{:else if scanState === 'done'}
				<p>No historical refs found in edit history.</p>
			{/if}
		</section>

		<section>
			<h2>Raw IndexedDB dump</h2>
			<p>
				Show every row in <code>coValues</code> and <code>deletedCoValues</code> so we can see
				exactly what's there.
			</p>
			<div>
				<button type="button" onclick={dumpRawDb} disabled={rawDumpState === 'loading'}>
					{rawDumpState === 'loading' ? 'Loading…' : 'Dump raw DB'}
				</button>
			</div>
			{#if rawDumpError}
				<p class="error">Dump error: {rawDumpError}</p>
			{/if}
			{#if rawDumpState === 'classifying' || rawDumpState === 'done'}
				<p>
					<strong>coValues:</strong>
					{coValueRows.length} rows · <strong>deletedCoValues:</strong>
					{deletedRows.length} rows
				</p>
				{#if rawDumpState === 'classifying'}
					<p>Classifying…</p>
				{/if}
				{#if Object.keys(classificationSummary).length > 0}
					<p>
						<strong>Classification:</strong>
						{#each Object.entries(classificationSummary) as [key, count]}
							<span>{key}: {count}</span>{' '}
						{/each}
					</p>
				{/if}

				{#if indexSummaries.length > 0}
					<h3>All <code>StudySessionIndex</code> CoValues</h3>
					<ul class="candidates">
						{#each indexSummaries as summary (summary.id)}
							<li>
								<div>
									<code>{summary.id}</code>
									{#if summary.schemaVersion !== undefined}
										<small>schema_version: {summary.schemaVersion}</small>
									{/if}
								</div>
								<div>
									{#if summary.sessionCount === 'loading'}
										loading…
									{:else if summary.sessionCount === 'unreachable'}
										<em>unreachable</em>
									{:else}
										<strong>{summary.sessionCount} sessions</strong>
										{#if summary.firstSessionIds.length > 0}
											<small>first: {summary.firstSessionIds.join(', ')}</small>
										{/if}
									{/if}
								</div>
								<div>
									<button
										type="button"
										onclick={() => restore(summary.id)}
										disabled={restoreState === 'restoring' ||
											summary.sessionCount === 'loading' ||
											summary.sessionCount === 'unreachable' ||
											summary.sessionCount === 0}
									>
										Restore this one
									</button>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
				{#if coValueRows.length > 0}
					<details>
						<summary>coValues ({coValueRows.length})</summary>
						<ul class="raw-rows">
							{#each coValueRows as row (row.id)}
								<li>
									<div>
										<code>{row.id}</code>
										<small>
											kind: <strong>{row.kind}</strong>{row.classification
												? ` → ${row.classification}`
												: ''} · {headerSummary(row.header)}
										</small>
									</div>
									<button type="button" onclick={() => probeAllSchemas(row.id)}>
										Probe
									</button>
								</li>
							{/each}
						</ul>
					</details>
				{/if}
				{#if probeId && probeResults.length > 0}
					<h3>Probe: <code>{probeId}</code></h3>
					{#each probeResults.filter((r) => r.loaded) as result (result.schema)}
						<details open={Object.keys(result.fields).length > 0}>
							<summary>
								<strong>{result.schema}</strong> — {Object.keys(result.fields).length} fields
							</summary>
							<ul class="probe-fields">
								{#each Object.entries(result.fields) as [key, value]}
									<li>
										<code>{key}</code>:
										{#if typeof value === 'string' && value.startsWith('<ref co_')}
											{@const refId = value.slice(5, -1).split(' ')[0]}
											<code>{value}</code>
											<button type="button" onclick={() => probeAllSchemas(refId)}>Chase</button>
										{:else if Array.isArray(value)}
											<ol class="probe-array">
												{#each value as item}
													<li>
														{#if typeof item === 'string' && item.startsWith('<ref co_')}
															{@const refId = item.slice(5, -1).split(' ')[0]}
															<code>{item}</code>
															<button type="button" onclick={() => probeAllSchemas(refId)}>
																Chase
															</button>
														{:else}
															<code>{JSON.stringify(item)}</code>
														{/if}
													</li>
												{/each}
											</ol>
										{:else}
											<code>{JSON.stringify(value)}</code>
										{/if}
									</li>
								{/each}
							</ul>
						</details>
					{/each}
				{/if}

				{#if deletedRows.length > 0}
					<details>
						<summary>deletedCoValues ({deletedRows.length})</summary>
						<ul class="raw-rows">
							{#each deletedRows as row (row.coValueID)}
								<li>
									<code>{row.coValueID}</code>
									<small>status: {String(row.status ?? '?')}</small>
								</li>
							{/each}
						</ul>
					</details>
				{/if}
			{/if}
		</section>

		<section>
			<h2>Scan local IndexedDB for StudySessions</h2>
			<p>
				Reads every CoValue in <code>jazz-storage</code>, tries each as a
				<code>StudySession</code>, and collects the ones that match. Then rebuild a fresh
				<code>StudySessionIndex</code> containing all of them.
			</p>
			<div>
				<button type="button" onclick={scanLocalDb} disabled={dbScanState === 'scanning'}>
					{dbScanState === 'scanning'
						? `Scanning… ${dbScanProgress.checked}/${dbScanProgress.total}`
						: 'Scan local DB'}
				</button>
			</div>
			{#if dbScanError}
				<p class="error">DB scan error: {dbScanError}</p>
			{/if}
			{#if foundSessions.length > 0}
				<p><strong>Found {foundSessions.length} sessions.</strong></p>
				<ul class="candidates">
					{#each foundSessions as session (session.id)}
						<li>
							<div>
								<code>{session.id}</code>
								<small>
									{session.participant} · {session.status} ·
									{session.roundsCount < 0 ? '?' : session.roundsCount} rounds ·
									{fmtTime(session.createdAtMs)}
								</small>
							</div>
						</li>
					{/each}
				</ul>
				<div>
					<button
						type="button"
						onclick={rebuildIndexFromScan}
						disabled={rebuildState === 'rebuilding'}
					>
						{rebuildState === 'rebuilding'
							? 'Rebuilding…'
							: `Rebuild index with these ${foundSessions.length} sessions`}
					</button>
				</div>
				{#if rebuildState === 'done'}
					<p class="success">Rebuilt. Reload <a href="/admin">/admin</a>.</p>
				{:else if rebuildError}
					<p class="error">Rebuild error: {rebuildError}</p>
				{/if}
			{:else if dbScanState === 'done'}
				<p>No <code>StudySession</code> CoValues found in local storage.</p>
			{/if}
		</section>

		<section>
			<h2>Inspect a CoValue id manually</h2>
			<p>
				If you know (or suspect) an old <code>StudySessionIndex</code> or
				<code>RateDateAccountRoot</code>
				id — for example from Jazz Inspector (inspector.jazz.tools) or from a prior account — paste
				it here to load it.
			</p>
			<div class="row">
				<input
					type="text"
					bind:value={manualId}
					placeholder="co_..."
					spellcheck="false"
					autocomplete="off"
				/>
				<button type="button" onclick={inspectManual} disabled={manualState === 'loading'}>
					{manualState === 'loading' ? 'Loading…' : 'Inspect'}
				</button>
			</div>
			{#if manualError}
				<p class="error">Inspect error: {manualError}</p>
			{/if}
			{#if manualResult}
				<ul class="candidates">
					<li>
						<div>
							<code>{manualResult.id}</code>
							<small>from {manualResult.source}</small>
						</div>
						<div>
							{#if manualResult.sessionCount === 'loading'}
								loading…
							{:else if manualResult.sessionCount === 'unreachable'}
								<em>unreachable — not a StudySessionIndex, or not in storage</em>
							{:else}
								<strong>{manualResult.sessionCount} sessions</strong>
								{#if manualResult.firstSessionIds.length > 0}
									<small>first: {manualResult.firstSessionIds.join(', ')}</small>
								{/if}
							{/if}
						</div>
						<div>
							<button
								type="button"
								onclick={() => restore(manualResult!.id)}
								disabled={restoreState === 'restoring' ||
									manualResult.sessionCount === 'loading' ||
									manualResult.sessionCount === 'unreachable'}
							>
								Restore this one
							</button>
						</div>
					</li>
				</ul>
			{/if}
		</section>

		{#if restoreState === 'restored'}
			<p class="success">Restored. Reload <a href="/admin">/admin</a>.</p>
		{:else if restoreError}
			<p class="error">Restore error: {restoreError}</p>
		{/if}
	{/if}
</div>

<style>
	section {
		display: grid;
		gap: var(--vs-sm);
		padding: var(--vs-md) 0;
		border-bottom: 1px solid var(--c-border);
	}
	.row {
		display: flex;
		gap: var(--vs-sm);
	}
	.row input {
		flex: 1;
		font-family: monospace;
	}
	.candidates {
		display: grid;
		gap: var(--vs-md);
		padding: 0;
		list-style: none;
	}
	.candidates li {
		display: grid;
		gap: var(--vs-sm);
		padding: var(--vs-md);
		border: 1px solid var(--c-border);
	}
	.raw-rows {
		display: grid;
		gap: var(--vs-sm);
		padding: 0;
		list-style: none;
		max-height: 400px;
		overflow-y: auto;
	}
	.raw-rows li {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--vs-xs);
		padding: var(--vs-sm);
		border-bottom: 1px solid var(--c-border);
	}
	.probe-fields {
		list-style: none;
		padding: 0;
		display: grid;
		gap: var(--vs-xs);
		font-size: 0.9em;
	}
	.probe-fields li {
		display: flex;
		gap: var(--vs-xs);
		align-items: center;
		flex-wrap: wrap;
	}
	.probe-array {
		display: grid;
		gap: var(--vs-xs);
		margin: 0;
		padding-left: var(--vs-md);
	}
	code {
		word-break: break-all;
	}
	small {
		display: block;
		opacity: 0.7;
	}
	.error {
		color: var(--c-error, crimson);
	}
	.success {
		color: var(--c-success, green);
	}
</style>
