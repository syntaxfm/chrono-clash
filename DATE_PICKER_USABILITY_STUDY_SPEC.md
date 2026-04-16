# Date Picker Usability Study Spec

## Document Info

- Version: 0.7 (draft)
- Goal: define a build-ready specification for a SvelteKit app that compares 3 date picker inputs in a structured user test
- Stack: `jazz-tools` (data + realtime), `SvelteKit` (UI + routing), `@drop-in/graffiti` (styling), `@sentry/sveltekit` Metrics

## 1) Product Summary

Build a focused usability testing app that runs participants through 3 date picker inputs. Each participant completes date challenges in each picker, in a balanced randomized order, then rates that picker on a 1-5 rubric:

- Design
- Ease of Use
- Magicalness

Primary output is a reliable comparison of input performance and user sentiment.

Speed data is tracked in two places:

- In-app (Jazz session data) so timing is directly available next to ratings.
- Sentry Metrics for observability and aggregate analysis.

### Standardized Study Naming

- `session`: one complete participant run across all three inputs.
- `input_round`: one input run inside a session, including `N` challenges and one rating step.
- `challenge`: one prompt + expected answer inside an input round.
- `challenge_run`: one participant's execution record for one challenge.

## 2) Goals and Non-Goals

### Goals

- Measure time-to-correct-date for each challenge, per participant, per picker.
- Persist speed data in-app, not only in Sentry.
- Measure correctness and attempts per challenge.
- Capture subjective ratings per picker with a consistent rubric.
- Compare picker performance using within-subject analysis (same participant uses all 3 pickers).
- Keep participant flow simple and low-friction.

### Non-Goals

- Natural language date parsing in-app.
- Open-ended date interpretation with ambiguous rules.
- Building a generic analytics warehouse for this app.

## 3) Experiment Design

### 3.1 Participants

- Each participant completes all 3 inputs.
- Participant identity is captured before start as `participant_id` + `first_name`.
- Participants do not create accounts and do not sign in.
- Participant access is session-link based (`/session/[sessionId]`) with no admin auth gate.
- Session ID alone is the participant access key (no extra token/secret).

### 3.2 Input Order (Counterbalancing)

Use permutations of 3 pickers to reduce order bias:

- `ABC`, `ACB`, `BAC`, `BCA`, `CAB`, `CBA`

`session_index` is the zero-based position of the session in `StudySessionIndex.sessions` at creation time. The admin session-creation flow reads `sessions.length` before calling the factory and passes the resulting picker order into the blueprint via `getPickerOrderForSession(sessionIndex)`.

Assignment options:

- Recommended: assign order by `session_index % 6` for balanced distribution.
- Acceptable fallback: random assignment if participant volume is low.

Recommendation: persist `session_index` on `StudySession` as a new optional field in a future additive migration so later analysis doesn't depend on list order surviving edits.

### 3.3 Challenges Per Picker

- Configurable `X` challenges per picker (default: `5`).
- Total challenges per participant = `3 * X`.

### 3.4 Challenge Sets

- Challenges live in a static TS file at `src/lib/components/date-picker-study/challenges.ts`, exporting an array of challenge groups.
- Each group contains a prompt template, a target date (`YYYY-MM-DD`), and optional variants at equivalent difficulty.
- Admin session creation picks three groups (one per input round) so each round draws from a different group to reduce memory effects.
- Difficulty parity across groups is a curation responsibility, not an algorithmic check.

## 4) User Flow

1. Admin (authenticated) creates a session; picker order + challenge assignments are generated and persisted immediately.
2. Participant lands on identity screen.
3. Participant enters `participant_id` and `first_name`, then clicks Start.
4. System starts the pre-assigned session plan.
5. Participant sees input #1 and completes `X` challenges.
6. Participant rates input #1 on 3 rubric dimensions.
7. Repeat for input #2 with a different challenge set.
8. Repeat for input #3 with a different challenge set.
9. Show completion screen.

## 5) Functional Requirements

### Session and Progress

- Admin can create a durable session record before participant entry.
- Admin can share the created session URL with a participant.
- Participant identity is bound to the session on Start.
- Participant flow must not require account signup or login.
- Participant access uses Jazz public-readable ownership on the session CoValue. The random CoValue ID in `/session/[sessionId]` is the access credential; no separate token is added.
- Participant writes (identity, timings, ratings) target the same CoValues via public-writable ownership. Verify against current Jazz behavior during implementation; fallback is a server-side writer proxy if anonymous writes aren't supported cleanly.
- Picker order and challenge sets are assigned at session creation, not participant start.
- Persist progress continuously (no manual save step).
- Support reload/resume to exact challenge/input-round state.

### State Ownership and UI Derivation

- Jazz state is the single source of truth for study workflow.
- Participant UI is a pure function of `StudySession` + active `StudyInputRound` + active `StudyChallengeRun` state.
- Do not maintain parallel local workflow state that can diverge from Jazz.
- Local component state is allowed only for ephemeral UI concerns (focus, transient hover/open state), not canonical study progress.
- Every workflow transition (start round, complete challenge, submit rating, complete session) is persisted in Jazz and then reflected by the UI.

### Challenge Execution

- Show one challenge at a time.
- Start timer when challenge is rendered and interactive.
- The participant runner is picker-agnostic: each picker adapter emits normalized `YYYY-MM-DD` values; the runner only reads those.
- On every emitted value, compare to `target_date_iso`.
- The first emission equal to the target completes the challenge and stops the timer.
- Each distinct emitted value _before_ the matching one counts as one attempt (`attempt_count`).
- Picker adapters may emit on any cadence appropriate to their input style (live-binding on each change for typed inputs, on blur/close/enter for calendar popovers). The runner does not care.
- Track click count and keypress count per challenge run (see §8.5).
- In Svelte, watch the current value reactively (for example with `$effect`) and complete on equality.
- Persist `elapsed_ms` in app data for each run.

### Input Integration

- All three date picker inputs are integrated as web components.
- Each web component is adapted to a shared interface that emits normalized `YYYY-MM-DD` values.
- The correctness engine is picker-agnostic and shared across all three inputs.

### Rating

- Require 1-5 stars for:
  - Design
  - Ease of Use
  - Magicalness
- Submit rating automatically as soon as all 3 dimensions are set.

### Completion

- Session marked `completed` only when all 3 input rounds + ratings are complete.

## 6) Data Model (Jazz)

This schema plan follows Jazz MCP guidance for long-lived local-first apps:

- model data as a graph of CoValues
- keep ownership and access control explicit
- prefer additive evolution only (no field renames/type changes)
- keep migrations small and rare by shipping forward-compatible shapes first

### 6.1 Migration-Light Strategy (Preferred)

- Add new study schemas first (`StudySession`, `StudyInputRound`, `StudyChallengeRun`).
- Keep all future fields additive and optional.
- Use CoValue IDs directly for participant URLs (`/session/[sessionId]`).
- Migrations are allowed, but only for safe initialization and backfill (no destructive schema changes).

### 6.2 Ownership Model

- There is one shared admin group. Every admin human is a writer member of that group — you are either an admin or you are not.
- The `StudySessionIndex` and every `StudySession` are owned by the admin group, not by the creating admin's account.
- Any admin (writer member of the group) can read/write any session.
- Participants do not join the admin group. They access sessions via the group's public-readable permission on `StudySession` (and its nested rounds/runs).
- Participant access is link-based to `/session/[sessionId]`. The random CoValue ID is the access credential; no extra token/secret is added.
- Admin routes (`/admin*`) require auth; participant routes (`/session/[sessionId]`) do not.

### 6.3 Exact Schema Blueprint (Field Contract)

```ts
import { co, z } from 'jazz-tools';

const PLAIN_DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ratingValue = z.number().int().min(1).max(5);

const sessionStatus = z.enum([
	'pending_participant',
	'in_progress',
	'paused',
	'completed',
	'abandoned',
	'cancelled'
]);

const roundStatus = z.enum([
	'pending',
	'in_progress',
	'paused',
	'awaiting_rating',
	'completed',
	'cancelled'
]);

export const StudyChallengeRun = co.map({
	schema_version: z.number().int().default(1),
	run_index: z.number().int().nonnegative(),
	challenge_group_id: z.string(),
	prompt_text: z.string(),
	target_date_iso: z.string().regex(PLAIN_DATE_KEY_REGEX),

	shown_at_ms: z.number().int().nonnegative().optional(),
	completed_at_ms: z.number().int().nonnegative().optional(),
	elapsed_ms: z.number().int().nonnegative().optional(),

	attempt_count: z.number().int().nonnegative().default(0),
	click_count: z.number().int().nonnegative().default(0),
	keypress_count: z.number().int().nonnegative().default(0),

	final_value_iso: z.string().regex(PLAIN_DATE_KEY_REGEX).optional(),
	is_correct: z.boolean().default(false)
});

export const StudyInputRound = co.map({
	schema_version: z.number().int().default(1),
	round_index: z.number().int().nonnegative(),
	picker_id: z.string(),
	picker_label: z.string(), // Input A/B/C

	status: roundStatus.default('pending'), // pending | in_progress | paused | awaiting_rating | completed | cancelled
	current_challenge_index: z.number().int().nonnegative().default(0),

	started_at_ms: z.number().int().nonnegative().optional(),
	ended_at_ms: z.number().int().nonnegative().optional(),
	total_elapsed_ms: z.number().int().nonnegative().optional(),
	average_elapsed_ms: z.number().int().nonnegative().optional(),

	rating_design: ratingValue.optional(),
	rating_ease_of_use: ratingValue.optional(),
	rating_magicalness: ratingValue.optional(),
	rating_submitted_at_ms: z.number().int().nonnegative().optional(),

	runs: co.list(StudyChallengeRun)
});

export const StudySession = co.map({
	schema_version: z.number().int().default(1),
	created_by_account_id: z.string(),
	created_at_ms: z.number().int().nonnegative(),

	participant_id: z.string().optional(),
	participant_first_name: z.string().optional(),

	started_at_ms: z.number().int().nonnegative().optional(),
	ended_at_ms: z.number().int().nonnegative().optional(),
	status: sessionStatus.default('pending_participant'), // pending_participant | in_progress | paused | completed | abandoned | cancelled

	timezone: z.string().optional(),
	locale: z.string().optional(),

	current_round_index: z.number().int().nonnegative().default(0),
	rounds: co.list(StudyInputRound)
});

export const StudySessionIndex = co.map({
	schema_version: z.number().int().default(1),
	sessions: co.list(StudySession)
});
```

### 6.4 Session Resolution

- Keep sessions discoverable from `StudySessionIndex.sessions`.
- Participant route loads a session directly by CoValue id from `/session/[sessionId]`.

### 6.5 Resolve Query Shape (Svelte `CoState`)

```ts
const STUDY_SESSION_RESOLVE = {
	rounds: {
		$each: {
			runs: {
				$each: true
			}
		}
	}
} as const;
```

### 6.6 Migration Plan (If Needed)

- Account/root migration is acceptable for pointer fields or indexes only.
- Prefer lazy initialization for new refs (create on first admin use) instead of eager migration writes.
- Never rename/remove/change field types in published study schemas.
- Status enums are append-only. If adding enum values later, rollout reader support first, then start writing new values.
- If a behavior must change, add a new optional field and branch on presence/version.

### 6.7 Integration With Existing App Schema

- `RateDateAccountRoot.study_session_index` is a _reference_ to the shared `StudySessionIndex` owned by the admin group — not an owned index under the admin's account.
  - `study_session_index?: StudySessionIndex` (optional, lazy-initialized per admin account on first load)
- This is additive and compatible with existing data.
- First-admin bootstrap flow:
  1. First admin ever: creates the admin group and the shared `StudySessionIndex` under that group. Writes the reference to their account root.
  2. Subsequent admins: resolve the existing shared index (via a well-known ID or invite acceptance — one-time per admin since there is only one group) and write the reference to their own root.
- Runtime session-creation flow for any admin:
  1. Admin account root loads.
  2. Resolve `root.study_session_index` (creating it only on the first-admin path above).
  3. Create sessions under `study_session_index.sessions`, owned by the admin group so every admin can read/write and participants can read via the group's public-readable permission.
- Existing non-study fields and behavior remain unchanged.

## 7) Correctness Rules

- Normalize all dates to `YYYY-MM-DD` before comparison.
- Use participant timezone for display, but compare canonical local date key.
- Correctness check is strict equality: `normalized_input_value === target_date_iso`.
- Correctness target is exact date match only.

## 8) Sentry Metrics Specification

Reference: `https://docs.sentry.io/platforms/javascript/guides/sveltekit/metrics/`

### 8.1 SDK Requirements

- Use `@sentry/sveltekit` with SDK `>= 10.25.0` for metrics support.
- Metrics are buffered; flush on hard completion transition if needed.

### 8.2 Metric Catalog

Metric naming convention:

- Use `study.<scope>.<measurement>`.
- Allowed scopes: `session`, `input_round`, `challenge`.

| Metric name                           | Type         | Unit        | When emitted                   |
| ------------------------------------- | ------------ | ----------- | ------------------------------ |
| `study.challenge.completed`           | count        | n/a         | challenge resolved correctly   |
| `study.challenge.duration_ms`         | distribution | millisecond | challenge resolved             |
| `study.challenge.attempt_count`       | distribution | n/a         | challenge resolved             |
| `study.challenge.click_count`         | distribution | n/a         | challenge resolved             |
| `study.challenge.keypress_count`      | distribution | n/a         | challenge resolved             |
| `study.input_round.rating`            | distribution | n/a         | rating submitted per dimension |
| `study.input_round.completed`         | count        | n/a         | after input round completion   |
| `study.input_round.total_duration_ms` | distribution | millisecond | after input round completion   |

### 8.3 Standard Metric Attributes

- `session_id`
- `participant_id` (pseudonymous)
- `picker_id`
- `challenge_id`
- `input_round_index`
- `challenge_index`
- `timezone`
- `locale`
- `device_class` (desktop/mobile)

For rating metrics only:

- `dimension` = `design | ease_of_use | magicalness`

### 8.4 Cardinality and Privacy

- Do not include raw prompt text in metric attributes.
- Do not include direct PII (email, full name).
- Do not include `first_name` in Sentry metric attributes.
- Keep total metric payload under Sentry limits.

### 8.5 Instrumentation Rules (Clicks and Keypresses)

- Interaction counters are scoped to the picker wrapper element only.
- Each challenge runner renders a single wrapper element around the active picker web component (for example `data-study-picker-wrapper`).
- All three pickers are web components rendered as direct children of the wrapper. No picker opens its UI in a portal or body-attached popover. Trusted DOM events are `composed: true` and bubble out of shadow DOM; `event.target` from outside the shadow boundary resolves to the host element (inside the wrapper).
- A single wrapper-scoped `addEventListener('click', …)` and `addEventListener('keydown', …)` correctly attribute all picker interactions.
- `click_count` increments on each `click` event whose target is inside the wrapper.
- `keypress_count` increments on each `keydown` event whose target is inside the wrapper.
- Ignore keydown events for pure modifier keys: `Shift`, `Control`, `Alt`, `Meta`.
- Do not count interactions outside the wrapper (including page-level shortcuts and other UI controls).
- Reset `click_count` and `keypress_count` to `0` at challenge start.
- Persist counts in `ChallengeRun` and emit matching Sentry metrics only once at challenge completion.

## 9) UI and Interaction Specification

### Participant UI

- Identity screen with semantic form controls (`participant_id`, `first_name`) and a Start button.
- Single task-focused screen with:
  - challenge prompt
  - one date picker
  - compact progress indicator (`2 / 5`)
- Immediate correctness feedback.
- Auto-advance after success (short delay for confirmation).
- No explicit save/submit buttons for challenge progress.

### Rating UI

- Three star rows (Design, Ease of Use, Magicalness).
- Auto-save when all ratings are selected.
- Clear visual selected state and keyboard accessibility.

### Admin UI

- Create session.
- Share participant access link/code.
- Realtime session list.
- Per-session progress and status.

### Styling

- CSS details are intentionally out of scope for this document.
- Prioritize clean semantic HTML and accessible structure.

## 10) Route Structure and Modules

### Page Routes

- `/admin` - admin dashboard with session list and create-session action.
- `/admin/sessions/new` - create a new session.
- `/admin/sessions/[sessionId]` - admin session detail view.
- `/session/[sessionId]` - single participant app route for everything from identity through completion.

### Route Notes

- No subroutes under `/session/[sessionId]`.
- Identity capture, challenge loop, rating loop, and completion all render inside `/session/[sessionId]` based on session state.
- No dedicated API routes required; session creation and progression use Jazz data directly.
- Route rendering logic reads canonical workflow state from Jazz rather than local duplicated state.

Feature colocation:

- `src/lib/components/date-picker-study/*` for study-specific components/stores/types
- `src/lib/utils/*` for shared date normalization and challenge evaluation helpers

## 11) Analysis Outputs

### Per Picker

- Median completion time
- P95 completion time
- Correct rate
- Mean attempts
- Mean rubric scores per dimension

### Per Challenge

- Median duration
- High-attempt frequency
- Difficulty calibration signal

### Comparative

- Within-participant deltas between pickers
- Overall weighted score (configurable)

## 12) Acceptance Criteria

- Each participant completes 3 input rounds in assigned order.
- Each challenge run stores correctness, duration, and attempts.
- Each challenge run stores click and keypress counts.
- Speed data is persisted in app records and queryable alongside ratings.
- Post-round ratings are captured for all 3 dimensions.
- Sentry metrics are emitted for challenge outcomes and ratings.
- Reloading mid-session restores progress correctly.
- Completion is only possible after all input rounds and ratings are done.
- Admin can create sessions and share session URLs with participants.

## 13) Delivery Plan

### Phase 1

- Admin session creation and participant entry flow
- Data schema and session engine
- Challenge evaluator and one picker adapter

### Phase 2

- Remaining two picker adapters
- Full input-round/rating progression

### Phase 3

- Sentry metrics instrumentation
- Metrics validation in Sentry UI

### Phase 4

- Pilot with internal participants
- Tune challenge sets and defaults

## 14) Locked Decisions

- `challenges_per_picker` default is `5`, configurable per session at creation time.
- No data export feature.
- No free-text comment capture.
