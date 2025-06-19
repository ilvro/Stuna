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
        precision: number;
    }> = {};

    data.forEach(question => {
        const day = getCalendarDay(question.created_at)
        if (!result[day]) {
            result[day] = {day: day, weekDay: getWeekDay(question.created_at), correct: 0, half: 0, incorrect: 0, total: 0, precision: 0}
        }

        result[day].total++;
        if (checkQuestion(question) == 'correct') result[day].correct++;
        if (checkQuestion(question) == 'half') result[day].half++;
        if (checkQuestion(question) == 'incorrect') result[day].incorrect++;
        result[day].precision = (result[day].correct + result[day].half/2)/result[day].total
    });

    /* result is
        2025-05-17: {day: '2025-05-17', weekDay: 'Saturday', correct: 0, half: 1, total: 2}
        2025-05-18: {day: '2025-05-18', weekDay: 'Sunday', correct: 3, half: 0, total: 4}
    */

    // add the days where the user didnt do any questions
    const dates = Object.keys(result).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const startDate = new Date(dates[0]);
    const todayDate = new Date();

    let loopingDate = new Date(startDate);
    while (loopingDate <= todayDate) {
        const year = loopingDate.getFullYear();
        const month = String(loopingDate.getMonth() + 1).padStart(2, '0');
        const day = String(loopingDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        if (!result[formattedDate]) {
            result[formattedDate] = {
                day: formattedDate,
                weekDay: getWeekDay(formattedDate),
                correct: 0,
                half: 0,
                incorrect: 0,
                total: 0,
                precision: 0
            };
        }

        loopingDate.setDate(loopingDate.getDate() + 1)
    }

    // turn results into an array (recharts only accepts arrays)
    const completeData = Object.values(result)

    // sort by date
    const orderedData = completeData.sort((a, b) => {
        const dateA = new Date(a.day);
        const dateB = new Date(b.day);
        return dateA.getTime() - dateB.getTime();
    });

    let recent = orderedData.slice(-range); // removes questions that dont belong in the range

    return recent
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

export function getStatsSummary(data: Question[], range: number) {
    // slice the data with the range
    let newData: Question[] = [];
    const currentDate = new Date();

    data.forEach(question => {
        // this is done with miliseconds and then converted to days again because the months mess with the calculation
        let questionDate = new Date(question.created_at.split('T')[0]);
        let diffInMs = currentDate.getTime() - questionDate.getTime()
        let diffDays = diffInMs / (1000 * 60 * 60 * 24);
        if (diffDays <= range) {
            newData.push(question);
        }
    })

    const total = newData.length;
    let correct = 0;
    let incorrect = 0;
    let half = 0;
    let totalTimeSec = 0;

    newData.forEach(question => {
        if (question.emoji === '✅') correct++;
        else if (question.emoji === '❌') incorrect++;
        else if (question.emoji === '☑️') half++;
        totalTimeSec += parseTimeStamp(question.timestamp);
    });

    const precision = total > 0 ? Math.round(((correct + half/2) / total) * 100) : 0;
    const averageTimeSec = total > 0 ? totalTimeSec / total : 0;

    return {
        totalQuestions: total,
        correct,
        half,
        precision: `${precision}%`,
        averageTime: formatSecondsToTime(averageTimeSec),
        totalTime: formatSecondsToHour(totalTimeSec),
        streak: getStreak(data)
    }
}

export function getStreak(data: Question[]) {
    let streak = 0;
    let lastDate: Date;
    let currentDate: Date;
    let uniqueDates = [];
    const dates = data.map(q => q.created_at.split('T')[0]);

    uniqueDates = Array.from(new Set(dates)).sort();
    for (let i = 0; i < uniqueDates.length; i++) {
        currentDate = new Date(uniqueDates[i]);
        lastDate = new Date(uniqueDates[i-1]);

        let diffInMs = currentDate.getTime() - lastDate.getTime()
        let diffDays = diffInMs / (1000 * 60 * 60 * 24);
        if (diffDays === 1 || diffDays === null) { /* diff null would be the first day */
            streak += 1
            /* console.log('user has a streak of ' + streak + ' days (day ' + currentDate.getDate() + ' )')*/
        }
        else {
            streak = 0; // diff in days is greater than 2, so the user lost the streak
        }
    }
    return streak
}