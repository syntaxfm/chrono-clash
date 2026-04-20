import { Group, co } from 'jazz-tools';

import {
	StudyChallengeRun,
	StudyInputRound,
	StudySession
} from '$lib/components/date-picker-study/schema';
import type { LoadedStudySession } from '$lib/components/date-picker-study/admin-workspace';

// Wire-format for a single session. Mirrors the schema shape exactly so an
// export round-trips through import with no loss of participant-entered data
// (timings, ratings, final values, counters). Version stamped so future
// imports can reject/transform incompatible snapshots.
export const EXPORT_FORMAT_VERSION = 1;

export type ExportedChallengeRun = {
	schema_version: number;
	run_index: number;
	challenge_group_id: string;
	prompt_text: string;
	target_date_iso: string;
	shown_at_ms?: number;
	completed_at_ms?: number;
	elapsed_ms?: number;
	attempt_count: number;
	click_count: number;
	keypress_count: number;
	final_value_iso?: string;
	is_correct: boolean;
};

export type ExportedRound = {
	schema_version: number;
	round_index: number;
	picker_id: string;
	picker_label: string;
	status: string;
	current_challenge_index: number;
	started_at_ms?: number;
	ended_at_ms?: number;
	total_elapsed_ms?: number;
	average_elapsed_ms?: number;
	rating_design?: number;
	rating_ease_of_use?: number;
	rating_magicalness?: number;
	runs: ExportedChallengeRun[];
};

export type ExportedSession = {
	schema_version: number;
	created_by_account_id: string;
	created_at_ms: number;
	session_index?: number;
	participant_id?: string;
	participant_first_name?: string;
	started_at_ms?: number;
	ended_at_ms?: number;
	status: string;
	timezone?: string;
	locale?: string;
	current_round_index: number;
	rounds: ExportedRound[];
};

export type ExportedStudy = {
	export_format_version: number;
	exported_at_ms: number;
	session_count: number;
	sessions: ExportedSession[];
};

export function exportSession(session: LoadedStudySession): ExportedSession {
	return {
		schema_version: session.schema_version,
		created_by_account_id: session.created_by_account_id,
		created_at_ms: session.created_at_ms,
		session_index: session.session_index,
		participant_id: session.participant_id,
		participant_first_name: session.participant_first_name,
		started_at_ms: session.started_at_ms,
		ended_at_ms: session.ended_at_ms,
		status: session.status,
		timezone: session.timezone,
		locale: session.locale,
		current_round_index: session.current_round_index,
		rounds: session.rounds
			.filter((r): r is NonNullable<typeof r> => Boolean(r))
			.map((round) => ({
				schema_version: round.schema_version,
				round_index: round.round_index,
				picker_id: round.picker_id,
				picker_label: round.picker_label,
				status: round.status,
				current_challenge_index: round.current_challenge_index,
				started_at_ms: round.started_at_ms,
				ended_at_ms: round.ended_at_ms,
				total_elapsed_ms: round.total_elapsed_ms,
				average_elapsed_ms: round.average_elapsed_ms,
				rating_design: round.rating_design,
				rating_ease_of_use: round.rating_ease_of_use,
				rating_magicalness: round.rating_magicalness,
				runs: round.runs
					.filter((r): r is NonNullable<typeof r> => Boolean(r))
					.map((run) => ({
						schema_version: run.schema_version,
						run_index: run.run_index,
						challenge_group_id: run.challenge_group_id,
						prompt_text: run.prompt_text,
						target_date_iso: run.target_date_iso,
						shown_at_ms: run.shown_at_ms,
						completed_at_ms: run.completed_at_ms,
						elapsed_ms: run.elapsed_ms,
						attempt_count: run.attempt_count,
						click_count: run.click_count,
						keypress_count: run.keypress_count,
						final_value_iso: run.final_value_iso,
						is_correct: run.is_correct
					}))
			}))
	};
}

// Recreate a session from an exported record. Preserves every participant-
// entered value (unlike the factory, which initializes runs in 'pending').
// Each session gets a fresh, public-writable Group so participants can still
// reach it via URL — same ownership shape as new sessions.
export function importSession(exported: ExportedSession) {
	const sessionGroup = Group.create();
	sessionGroup.makePublic('writer');

	const rounds = exported.rounds.map((round) => {
		const runs = round.runs.map((run) =>
			StudyChallengeRun.create(
				{
					schema_version: run.schema_version,
					run_index: run.run_index,
					challenge_group_id: run.challenge_group_id,
					prompt_text: run.prompt_text,
					target_date_iso: run.target_date_iso,
					shown_at_ms: run.shown_at_ms,
					completed_at_ms: run.completed_at_ms,
					elapsed_ms: run.elapsed_ms,
					attempt_count: run.attempt_count,
					click_count: run.click_count,
					keypress_count: run.keypress_count,
					final_value_iso: run.final_value_iso,
					is_correct: run.is_correct
				},
				{ owner: sessionGroup }
			)
		);

		const runsList = co.list(StudyChallengeRun).create(runs, { owner: sessionGroup });

		return StudyInputRound.create(
			{
				schema_version: round.schema_version,
				round_index: round.round_index,
				picker_id: round.picker_id,
				picker_label: round.picker_label,
				status: round.status as 'pending',
				current_challenge_index: round.current_challenge_index,
				started_at_ms: round.started_at_ms,
				ended_at_ms: round.ended_at_ms,
				total_elapsed_ms: round.total_elapsed_ms,
				average_elapsed_ms: round.average_elapsed_ms,
				rating_design: round.rating_design,
				rating_ease_of_use: round.rating_ease_of_use,
				rating_magicalness: round.rating_magicalness,
				runs: runsList
			},
			{ owner: sessionGroup }
		);
	});

	const roundsList = co.list(StudyInputRound).create(rounds, { owner: sessionGroup });

	return StudySession.create(
		{
			schema_version: exported.schema_version,
			created_by_account_id: exported.created_by_account_id,
			created_at_ms: exported.created_at_ms,
			session_index: exported.session_index,
			participant_id: exported.participant_id,
			participant_first_name: exported.participant_first_name,
			started_at_ms: exported.started_at_ms,
			ended_at_ms: exported.ended_at_ms,
			status: exported.status as 'pending_participant',
			timezone: exported.timezone,
			locale: exported.locale,
			current_round_index: exported.current_round_index,
			rounds: roundsList
		},
		{ owner: sessionGroup }
	);
}
