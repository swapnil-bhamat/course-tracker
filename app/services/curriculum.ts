export interface Topic {
    name: string
    estimated_time_hours: number
    interview_frequency_score: number
    status: 'pending' | 'in_progress' | 'completed'
    material: string[]
    repoLink?: string
}

export interface Section {
    title: string
    topics: Topic[]
}

export interface Domain {
    title: string
    estimated_days: number
    sections: Record<string, Section>
}

export interface Curriculum {
    meta: {
        goal: string
        duration_days: number
        daily_study_hours: string
    }
    [key: string]: Domain | any
}

export const curriculumData: Curriculum = {} as Curriculum

