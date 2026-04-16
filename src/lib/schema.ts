import { co } from 'jazz-tools';

import {
	STUDY_SESSION_INDEX_RESOLVE,
	StudySessionIndex
} from '$lib/components/date-picker-study/schema';

// Account root is kept minimal: one optional pointer to the study index.
//
// Optional (not required) because the pointer is lazy-initialized the first
// time the admin creates a session. Jazz migration guidance warns that
// migrations require write access, and new-account bootstrap runs before any
// other write — making the field optional lets existing accounts load
// unchanged and avoids an eager backfill.
//
// One pointer (not inlined fields) so the study index is its own CoValue
// with its own identity. That keeps the root shape small and lets the index
// be resolved independently from the rest of the account.
export const RateDateAccountRoot = co.map({
	study_session_index: StudySessionIndex.optional()
});

export const RateDateAccount = co.account({
	profile: co.profile(),
	root: RateDateAccountRoot
});

// Account-level resolve chains straight through to the study index resolve
// so a single load covers "log in and show the admin dashboard".
export const RATE_DATE_ACCOUNT_RESOLVE = {
	root: {
		study_session_index: STUDY_SESSION_INDEX_RESOLVE
	}
} as const;
