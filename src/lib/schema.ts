import { co } from 'jazz-tools';

import {
	STUDY_SESSION_INDEX_RESOLVE,
	StudySession,
	StudySessionIndex
} from '$lib/components/date-picker-study/schema';

// Account root holds the admin's private list of sessions they have created.
// Per-session public access is attached when each session is created (see
// admin-workspace.ts), not here.
export const RateDateAccountRoot = co.map({
	study_session_index: StudySessionIndex
});

// Initialize the root on account creation. `creationProps` is only defined
// on the very first run for an account; subsequent logins skip straight
// through, so there's no idempotency guard to maintain.
export const RateDateAccount = co
	.account({
		profile: co.profile(),
		root: RateDateAccountRoot
	})
	.withMigration((account, creationProps) => {
		if (!creationProps) return;
		account.$jazz.set(
			'root',
			RateDateAccountRoot.create({
				study_session_index: StudySessionIndex.create({
					schema_version: 1,
					sessions: co.list(StudySession).create([])
				})
			})
		);
	});

export const RATE_DATE_ACCOUNT_RESOLVE = {
	root: {
		study_session_index: STUDY_SESSION_INDEX_RESOLVE
	}
} as const;
