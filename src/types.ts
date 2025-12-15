// Состояния карточки в системе SRS
export type CardState = 'new' | 'learning' | 'review' | 'relearning';

// Оценка пользователем того, насколько хорошо он знает карточку
export type CardRating = 'again' | 'hard' | 'good' | 'easy';

// Отдельная карточка
export interface Card {
    id: string;
    deckId: string;
    front: string; // Вопрос
    back: string;  // Ответ
    createdAt: number;

    // SRS поля
    nextReviewDate: number; // Дата следующего повторения
    interval: number;       // Текущий интервал в днях
    easeFactor: number;     // Коэффициент легкости (начинается с 2.5)
    repetition: number;     // Количество успешных повторений
    state: CardState;
}

// Набор (коллекция карточек)
export interface Deck {
    id: string;
    name: string;
    description?: string;
    color?: string; // Для темы UI
    createdAt: number;
}

// Запись лога повторений
export interface ReviewLog {
    id: string;
    cardId: string;
    reviewedAt: number;
    rating: CardRating;
    timeSpent: number; // миллисекунды
}

// Статистика
export interface DeckStats {
    deckId: string;
    totalCards: number;
    newCards: number;
    learningCards: number;
    reviewCards: number;
    dueToday: number;
}

export interface SRSSettings {
    againDelayMinutes: number; // 10
    hardMultiplier: number;    // 1.2
    goodMultiplier: number;    // 2.5
    easyMultiplier: number;    // 3.0
}
