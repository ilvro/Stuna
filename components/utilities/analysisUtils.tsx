import { getCalendarDay, getWeekDay } from './formatDate'
import Question from '../../types/types.tsx'

const checkQuestion = (question: Question) => {
    return question.emoji == '✅' ? 'correct'
        : question.emoji == '❌' ? 'incorrect'
        : question.emoji == '☑️' ? 'half'
        : null;
}

export default function processReport(data: Question[], range: number) {
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