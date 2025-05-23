import { BarChart, Bar } from 'recharts';
import Question from '../types/types';

interface AnalysisProps {
    data: Question[];
}

export default function BarAnalysis({ data }: AnalysisProps) {
    if (!data || data.length === 0) return [];
    const checkQuestion = (question: Question) => {
        return question.emoji == '✅' ? 'correct'
            : question.emoji == '❌' ? 'incorrect'
            : question.emoji == '☑️' ? 'half'
            : null;
    }

    return (
        <div>
            {data.map((q) => (
                <div>{q.emoji}</div>
            ))}
        </div>
    )
}