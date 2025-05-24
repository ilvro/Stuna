import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Question from '../types/types';
import { formatShortDate } from './utilities/formatDate'

interface AnalysisProps {
    data: Question[];
    range: number
}

export default function GraphAnalysis({ data, range }: AnalysisProps) {
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
    const processReport = (data: Question[], range: number) => {
        let result: Record<string, {
            day: string; 
            weekDay: string; 
            correct: number; 
            half: number; 
            incorrect: number;
            total: number;
            field: string;
        }> = {};

        data.forEach(question => {
            const day = getCalendarDay(question.created_at)
            if (!result[day]) {
                result[day] = {day: day, weekDay: getWeekDay(question.created_at), correct: 0, half: 0, incorrect: 0, total: 0, field: question.field}
            }

            result[day].total++;
            if (checkQuestion(question) == 'correct') result[day].correct++;
            if (checkQuestion(question) == 'half') result[day].half++;
            if (checkQuestion(question) == 'incorrect') result[day].incorrect++;
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
        let recent = orderedByDate.slice(-range); // removes questions that dont belong in the range

        // format array objects into one object (ignores the first one, its just the date and messes up with recharts)
        return recent.map(([ , value]) => value)
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={processReport(data, range)} /* recharts automatically loops through every data item */
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
                <XAxis 
                    dataKey={range > 7 ? "day" : "weekDay"}

                    /* format text for when the full date is displayed */
                    tickFormatter={(date) => {
                        return range > 7 ? formatShortDate(date) : date; // para weekDay
                    }}
                    angle={range > 7 ? -45 : 0}
                    textAnchor={range > 7 ? "end" : "middle"}
                    tick={{ fontSize: 10 }}
                    />
                <YAxis></YAxis>

                <Tooltip></Tooltip>
                <Legend></Legend>
                <Bar dataKey="correct" stackId='a' fill="#1699b8"></Bar>
                <Bar dataKey="half" stackId='a' fill="#1699b8" fillOpacity="0.5"></Bar>
                <Bar dataKey="incorrect" stackId='a' fill="#8884d8"></Bar>

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