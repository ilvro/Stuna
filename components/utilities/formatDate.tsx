function getTime(dateString: Date) {
    return dateString.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

function getDate(dateString: Date) {
    return dateString.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    })
}

export function formatDate(dateString: string): string {
    const today = new Date();
    const date = new Date(dateString);

    if (today.getDate() === date.getDate() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear()) {
        return `Today | ${getTime(date)}`;
    } else if (today.getDate() - date.getDate() === 1) {
        return `Yesterday | ${getTime(date)}`
    } else {
        return `${getDate(date)} | ${getTime((date))}`
    }
}