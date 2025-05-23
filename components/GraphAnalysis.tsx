import { BarChart, Bar, ResponsiveContainer, CartesianGrid, Rectangle, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Question from '../types/types';

interface AnalysisProps {
    data: Question[];
}

export default function BarAnalysis({ data }: AnalysisProps) {
    if (!data || data.length === 0) return null;
    const checkQuestion = (question: Question) => {
        return question.emoji == '✅' ? 'correct'
            : question.emoji == '❌' ? 'incorrect'
            : question.emoji == '☑️' ? 'half'
            : null;
    }
    const convertTime = (timestamp: string) => {
        const [minutes, seconds] = timestamp.split(':').map(Number);
        return minutes + seconds / 60;
    }
    const chartData = data.map(q => ({
        test: q.test,
        time: convertTime(q.timestamp)
    }))

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
            }}>
                <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
                <XAxis dataKey="test"></XAxis>
                <YAxis></YAxis>
                <Tooltip></Tooltip>
                <Legend></Legend>
                <Bar dataKey="time" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue"></Rectangle>}></Bar>

            </BarChart>
        </ResponsiveContainer>
        /*
        <div>
            {data.map((q) => (
                <div>{q.emoji}</div>
            ))}
        </div>*/
    )
}