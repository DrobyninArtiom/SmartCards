import type { Card, CardRating, CardState } from '../types';

// Константы алгоритма SM-2
const EASE_FACTOR_MIN = 1.3;
const EASE_FACTOR_DEFAULT = 2.5;
const EASE_FACTOR_MAX = 2.5;

// Множители интервала для разных оценок
const RATING_MULTIPLIERS = {
    again: 0,
    hard: 1.2,
    good: 2.5,
    easy: 3.0,
} as const;

/**
 * Рассчитать параметры следующего повторения на основе алгоритма SM-2
 */
export function calculateNextReview(card: Card, rating: CardRating): Partial<Card> {
    const now = Date.now();

    // "Снова" - сброс карточки
    if (rating === 'again') {
        return {
            state: 'relearning' as CardState,
            interval: 0,
            repetition: 0,
            nextReviewDate: now + 10 * 60 * 1000, // 10 минут
            easeFactor: Math.max(card.easeFactor - 0.2, EASE_FACTOR_MIN),
        };
    }

    // Рассчитать новый коэффициент легкости
    let newEaseFactor = card.easeFactor;
    if (rating === 'hard') {
        newEaseFactor = Math.max(card.easeFactor - 0.15, EASE_FACTOR_MIN);
    } else if (rating === 'easy') {
        newEaseFactor = Math.min(card.easeFactor + 0.15, EASE_FACTOR_MAX);
    }

    // Рассчитать новый интервал
    let newInterval: number;
    const newRepetition = card.repetition + 1;

    if (newRepetition === 1) {
        newInterval = 1; // 1 день
    } else if (newRepetition === 2) {
        newInterval = 6; // 6 дней
    } else {
        newInterval = Math.round(card.interval * newEaseFactor * RATING_MULTIPLIERS[rating]);
    }

    // Рассчитать дату следующего повторения
    const nextReviewDate = now + newInterval * 24 * 60 * 60 * 1000;

    return {
        state: 'review' as CardState,
        interval: newInterval,
        repetition: newRepetition,
        easeFactor: newEaseFactor,
        nextReviewDate,
    };
}

/**
 * Получить карточки, доступные для повторения
 */
export function getDueCards(cards: Card[]): Card[] {
    const now = Date.now();
    return cards.filter(card => card.nextReviewDate <= now);
}

/**
 * Создать новую карточку со значениями SRS по умолчанию
 */
export function createNewCard(deckId: string, front: string, back: string): Card {
    return {
        id: crypto.randomUUID(),
        deckId,
        front,
        back,
        createdAt: Date.now(),
        nextReviewDate: Date.now(), // Доступна сразу
        interval: 0,
        easeFactor: EASE_FACTOR_DEFAULT,
        repetition: 0,
        state: 'new',
    };
}
