import { BarChart, Bar, ResponsiveContainer, CartesianGrid, Rectangle, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Question from '../types/types';

interface AnalysisProps {
    data: Question[];
}

export default function GraphAnalysis({ data }: AnalysisProps) {
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

    const getCalendarDay = (dateString: string) => {
        return dateString.split("T")[0]
    }

    const getWeekDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', {weekday: 'long'})
    }

    // one object for each day
    const processWeeklyReport = (data: Question[]) => {
        let result: Record<string, {
            day: string; 
            weekDay: string; 
            correct: number; 
            half: number; 
            total: number;
            field: string;}> = {};

        data.forEach(question => {
            const day = getCalendarDay(question.created_at)
            if (!result[day]) {
                result[day] = {day: day, weekDay: getWeekDay(question.created_at), correct: 0, half: 0, total: 0, field: question.field}
            }

            result[day].total++;
            if (checkQuestion(question) == 'correct') result[day].correct++;
            if (checkQuestion(question) == 'half') result[day].half++;
        });

        /* result is
            2025-05-17: {day: '2025-05-17', weekDay: 'Saturday', correct: 0, half: 1, total: 2}
            2025-05-18: {day: '2025-05-18', weekDay: 'Sunday', correct: 3, half: 0, total: 4}
        */
        // turn results into an array (recharts only accepts arrays)
        // object.entries turns each of objects into paired arrays. we will turn them into a single object after using the first object (date) to sort them
        const questionsArray = Object.entries(result)

        // sort the array by chronological order (the discord bot will do that, but just in case the data doesnt come from discord)
        const orderedByDate = questionsArray.sort((a, b) => {
            const dateA = new Date(a[0]).getTime();
            const dateB = new Date(b[0]).getTime();
            return dateA - dateB
        })

        let recent = orderedByDate.slice(-7); // get last 7 days, filter will handle this later when its added
        recent.map(entry => {
            const value = entry[1];
            return value;
        })

        // format array objects into one object (ignores the first one, its just the date and messes up with recharts)
        return recent.map(([ , value]) => value)
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={processWeeklyReport(data)} /* recharts automatically loops through every data item */
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
            }}>
                <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
                <XAxis dataKey="weekDay"></XAxis>
                <YAxis></YAxis>
                <Tooltip></Tooltip>
                <Legend></Legend>
                <Bar dataKey="correct" stackId="a" fill="#1699b8" activeBar={<Rectangle fill="pink" stroke="blue"></Rectangle>}></Bar>
                <Bar dataKey="total" stackId="a" fill="#8884d8" activeBar={<Rectangle fill="blue" stroke="pink"></Rectangle>}></Bar>

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