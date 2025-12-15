/**
 * Генерировать уникальный ID
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Форматировать метку времени в читаемую дату
 */
export function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Форматировать метку времени в относительную строку времени
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = timestamp - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Просрочено';
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Завтра';
    if (days < 7) return `Через ${days} дн.`;
    if (days < 30) return `Через ${Math.floor(days / 7)} нед.`;
    return `Через ${Math.floor(days / 30)} мес.`;
}

/**
 * Перемешать массив (алгоритм Фишера-Йетса)
 */
export function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
