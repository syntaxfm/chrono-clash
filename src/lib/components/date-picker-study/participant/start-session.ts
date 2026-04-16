import type { Loaded } from 'jazz-tools';

import { STUDY_SESSION_RESOLVE, type StudySession } from '$lib/components/date-picker-study/schema';

export type LoadedParticipantSession = Loaded<typeof StudySession, typeof STUDY_SESSION_RESOLVE>;

export type StartSessionInput = {
	participantId: string;
	participantFirstName: string;
	// Injectable so tests can pin time/locale. In production the caller omits
	// both and live values win.
	nowMs?: number;
	timezone?: string;
	locale?: string;
};

// Transition a session from pending_participant → in_progress.
//
// Writes every session-level identity/timing field in one place so the state
// machine never has to guess which fields got set elsewhere. Round-level
// start (pending → in_progress) is intentionally NOT done here; the challenge
// engine (nh2jcw17) owns round lifecycle so timing starts exactly when the
// first challenge is rendered.
//
// Throws on empty identity or wrong session status rather than silently
// coercing — the UI should never submit blank identity, and resume attempts
// on already-started sessions should be handled by the state machine (show
// the current step), not by re-running Start.
export function startParticipantSession(
	session: LoadedParticipantSession,
	input: StartSessionInput
): void {
	const participantId = input.participantId.trim();
	const participantFirstName = input.participantFirstName.trim();

	if (participantId.length === 0) {
		throw new TypeError('participantId must be a non-empty string');
	}
	if (participantFirstName.length === 0) {
		throw new TypeError('participantFirstName must be a non-empty string');
	}
	if (session.status !== 'pending_participant') {
		throw new Error(
			`cannot start session with status "${session.status}" (expected "pending_participant")`
		);
	}

	const startedAtMs = input.nowMs ?? Date.now();
	const timezone = input.timezone ?? resolveTimezone();
	const locale = input.locale ?? resolveLocale();

	session.$jazz.set('participant_id', participantId);
	session.$jazz.set('participant_first_name', participantFirstName);
	session.$jazz.set('started_at_ms', startedAtMs);
	if (timezone) session.$jazz.set('timezone', timezone);
	if (locale) session.$jazz.set('locale', locale);
	session.$jazz.set('status', 'in_progress');
}

// Resolve host-IANA timezone once per call; returns undefined on platforms
// that don't expose Intl (older crawlers, sandboxed previews). Keeping the
// fallback undefined lets the schema field stay unset rather than storing
// bogus data.
function resolveTimezone(): string | undefined {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	} catch {
		return undefined;
	}
}

function resolveLocale(): string | undefined {
	if (typeof navigator === 'undefined') return undefined;
	return navigator.language;
}
