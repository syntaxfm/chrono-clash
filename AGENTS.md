# AGENTS.md

## Product Model

- This is a collaborative realtime todo app built on Jazz.
- Collaboration is org-centric: people work together by joining the same organization.
- Canonical flow: User A creates an org, invites User B, User B accepts, and both are members of that org.
- Membership is symmetric after joining: User A can assign todos to User B, and User B can assign todos to User A.
- Membership can overlap across orgs; do not assume users belong to only one collaboration group.
- Assignment follows shared-org relationships: if A+B are in Org Z and A+C are in Org M, A can assign to B or C, and both B and C can assign to A.
- Non-goal: do not model collaboration as one global team or one-org-per-user.
- Keep todo collaboration intentional: users should primarily see their own work plus work explicitly shared/assigned with them.
- Preserve these product behaviors when refactoring; optimize for collaboration outcomes, not any single storage implementation.

## Repo Shape

- Single-package SvelteKit app; the root importer is the only workspace package (`pnpm-workspace.yaml` only sets `onlyBuiltDependencies`).
- Main wiring lives in `src/routes/+layout.svelte`: imports `@drop-in/graffiti`, wraps app with `JazzSvelteProvider`, and uses `PasskeyAuthBasicUI`.
- Collaboration model and account migration logic are centered in `src/lib/schema.ts`; start there when changing org/todo behavior.

## Commands (Source of Truth: `package.json`)

- `pnpm dev` - run Vite dev server (default Vite port unless overridden).
- `pnpm check` - run `svelte-kit sync` then `svelte-check`.
- `pnpm lint` - run Prettier check first, then ESLint.
- `pnpm build` - production build.
- `pnpm format` - write Prettier formatting.
- There is no test script in this repo right now.

## Environment and Tooling Gotchas

- Package manager is pinned to `pnpm@10.33.0` (`packageManager` field).
- `.npmrc` sets `engine-strict=true`; dependency installs fail on unsupported Node engines.
- Svelte runes mode is forced for project files in `svelte.config.js`.
- TS is strict, and JS is type-checked too (`allowJs: true`, `checkJs: true` in `tsconfig.json`).

## Jazz/Collaboration Notes

- The app is configured to sync against `ws://127.0.0.1:4200` in `src/routes/+layout.svelte`; if that peer is unavailable, sync/collab flows will be limited.
- `sync-db/storage.db*` are local SQLite runtime files; do not hand-edit them.
- Use Jazz mcp to understand Jazz best practices

## Verification Order for Changes

- Prefer this local sequence before handoff: `pnpm lint` -> `pnpm check` -> `pnpm build`.

## TypeScript

DO NOT use `any` and do not rely on casting unless absolutely necessary. this is a code smell and an indication you are doing something wrong.

## Naming

Don't name functions handle* that could just be named *. For instance always name a function save() instead of handleSave()
