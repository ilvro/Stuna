import { getCalendarDay, getWeekDay } from './formatDate'
import Question from '../../types/types.tsx'

const checkQuestion = (question: Question) => {
    return question.emoji == '✅' ? 'correct'
        : question.emoji == '❌' ? 'incorrect'
        : question.emoji == '☑️' ? 'half'
        : null;
}

export function processReport(data: Question[], range: number) {
    let result: Record<string, {
        day: string; 
        weekDay: string; 
        correct: number; 
        half: number; 
        incorrect: number;
        total: number;
    }> = {};

    data.forEach(question => {
        const day = getCalendarDay(question.created_at)
        if (!result[day]) {
            result[day] = {day: day, weekDay: getWeekDay(question.created_at), correct: 0, half: 0, incorrect: 0, total: 0}
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

function parseTimeStamp(timestamp: string): number {
    const [min, sec] = timestamp.split(':').map(Number);
    return min * 60 + sec;
}

function formatSecondsToTime(seconds: number): string {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0')
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function formatSecondsToHour(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    return `${hours}h${min > 0 ? ` ${min}min` : ''}`;
}

export function getStatsSummary(data: Question[]) {
    const total = data.length;
    let correct = 0;
    let incorrect = 0;
    let half = 0;
    let totalTimeSec = 0;

    data.forEach(question => {
        if (question.emoji === '✅') correct++;
        else if (question.emoji === '❌') incorrect++;
        else if (question.emoji === '☑️') half++;
        totalTimeSec += parseTimeStamp(question.timestamp);
    });

    const precision = total > 0 ? Math.round((correct / total) * 100) : 0;
    const averageTimeSec = total > 0 ? totalTimeSec / total : 0;

    return {
        totalQuestions: total,
        correct,
        precision: `${precision}%`,
        averageTime: formatSecondsToTime(averageTimeSec),
        totalTime: formatSecondsToHour(totalTimeSec),
        streak: 14 /* still placeholder */
    }
}