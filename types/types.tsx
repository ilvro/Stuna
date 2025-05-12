export default interface Question {
    created_at: string;
    timestamp: string;
    emoji: string;
    test: string;
    question_number: string;
    field: string;
    comment: string;
    image_url?: string;
}