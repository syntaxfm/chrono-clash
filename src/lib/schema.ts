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

// Only runs on first account creation. Never writes to root on subsequent
// logins — previously we "healed" missing fields here, which could overwrite
// a ref whose target CoValue was transiently unreachable, losing the pointer
// to real data. If a required field is ever missing on an existing root,
// surface the error in the UI (see /admin/recovery) rather than papering
// over it with a write.
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
