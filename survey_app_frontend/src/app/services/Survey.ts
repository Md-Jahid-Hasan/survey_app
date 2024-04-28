export interface SurveyList {
    id?: number,
    title: string,
    started_at: string,
    ended_at: string,
    created_by: number,
    is_ended: boolean,
    is_joined: boolean,
    survey_time: string
}

export interface SurveyDetails {
    title: string,
    survey_time: string,
    ended_at: string,
    is_ended: boolean,
    is_submitted: boolean,
    questions: Question[]
}

interface Question {
    id?: number,
    question: string,
    question_type: string
    text_answer?: any,
    options: Option[]
}


interface Option {
    id?: boolean,
    option_text: string
    answer?: boolean
}

export interface Answer {
    question: number,
    option?: number,
    text_answer?: string
}
