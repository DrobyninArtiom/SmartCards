import type { Card } from '../types';

export interface GlobalStats {
    total: number;
    new: number;
    learning: number;
    review: number;
    due: number;
}

export function calculateGlobalStats(cards: Card[]): GlobalStats {
    const now = Date.now();

    return {
        total: cards.length,
        new: cards.filter(c => c.state === 'new').length,
        learning: cards.filter(c => c.state === 'learning' || c.state === 'relearning').length,
        review: cards.filter(c => c.state === 'review').length,
        due: cards.filter(c => c.nextReviewDate && c.nextReviewDate <= now).length
    };
}
