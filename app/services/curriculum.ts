export interface Topic {
    name: string
    status: 'pending' | 'in_progress' | 'completed'
    micro_task: string
    last_touched_date: string | null
    repoLink?: string
}

export interface Track {
    title: string
    topics: Topic[]
}

export interface Curriculum {
    meta: {
        goal: string
        duration_days: number
        career_context: {
            experience_years: string
            current_state: string
            strategy: string
            constraints: string[]
            financial_state: string
        }
        preparation_philosophy: string
    }
    GLOBAL_DEFAULTS: {
        calendar_block_minutes: number
        fallback_block_minutes: number
        preferred_time_windows: string[]
        success_definition: string
        progress_metric: string
    }
    CONSISTENCY_MODEL: {
        rules: string[]
        energy_modes: {
            normal: {
                calendar_block_minutes: number
                allowed_actions: string[]
            }
            low: {
                calendar_block_minutes: number
                allowed_actions: string[]
            }
        }
    }
    WEEKLY_CONTROL: {
        weekly_focus: string | null
        max_active_topics: number
        weekly_review_minutes: number
        adaptation_rules: {
            missed_sessions: string
            low_energy: string
        }
    }
    CAREER_TARGET: {
        target_roles: string[]
        avoid_roles: string[]
    }
    STUDY_TRACK: Record<string, Track>
    DECISION_NARRATIVES: {
        title: string
        topics: Topic[]
    }
    INTERVIEW_READINESS: {
        round_mapping: Record<string, {
            focus: string[]
            expected_output: string
        }>
        application_readiness_gate: {
            purpose: string
            rule: string
            minimum_gates: Record<string, {
                required_topics: string[]
                completion_criteria: string
            }>
            confidence_threshold: string
            recommendation_on_pass: string
        }
        mock_interviews: {
            frequency: string
            status: string
        }
    }
    OUTPUT_ARTIFACTS: {
        types: string[]
        storage: string
    }
}

export const curriculumData: Curriculum = {} as Curriculum

