import type { Card, Deck, ReviewLog } from '../types';

const STORAGE_KEYS = {
    DECKS: 'smartcards_decks',
    CARDS: 'smartcards_cards',
    REVIEWS: 'smartcards_reviews',
} as const;

// Общие утилиты хранилища
class Storage {
    static get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return null;
        }
    }

    static set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
        }
    }

    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    }

    static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}

// Операции с наборами
export const DeckStorage = {
    getAll(): Deck[] {
        return Storage.get<Deck[]>(STORAGE_KEYS.DECKS) || [];
    },

    getById(id: string): Deck | null {
        const decks = this.getAll();
        return decks.find(deck => deck.id === id) || null;
    },

    save(deck: Deck): void {
        const decks = this.getAll();
        const index = decks.findIndex(d => d.id === deck.id);

        if (index >= 0) {
            decks[index] = deck;
        } else {
            decks.push(deck);
        }

        Storage.set(STORAGE_KEYS.DECKS, decks);
    },

    delete(id: string): void {
        const decks = this.getAll().filter(deck => deck.id !== id);
        Storage.set(STORAGE_KEYS.DECKS, decks);
    },
};

// Операции с карточками
export const CardStorage = {
    getAll(): Card[] {
        return Storage.get<Card[]>(STORAGE_KEYS.CARDS) || [];
    },

    getById(id: string): Card | null {
        const cards = this.getAll();
        return cards.find(card => card.id === id) || null;
    },

    getByDeckId(deckId: string): Card[] {
        return this.getAll().filter(card => card.deckId === deckId);
    },

    save(card: Card): void {
        const cards = this.getAll();
        const index = cards.findIndex(c => c.id === card.id);

        if (index >= 0) {
            cards[index] = card;
        } else {
            cards.push(card);
        }

        Storage.set(STORAGE_KEYS.CARDS, cards);
    },

    delete(id: string): void {
        const cards = this.getAll().filter(card => card.id !== id);
        Storage.set(STORAGE_KEYS.CARDS, cards);
    },

    deleteByDeckId(deckId: string): void {
        const cards = this.getAll().filter(card => card.deckId !== deckId);
        Storage.set(STORAGE_KEYS.CARDS, cards);
    },
};

// Операции с логами повторений
export const ReviewStorage = {
    getAll(): ReviewLog[] {
        return Storage.get<ReviewLog[]>(STORAGE_KEYS.REVIEWS) || [];
    },

    getByCardId(cardId: string): ReviewLog[] {
        return this.getAll().filter(log => log.cardId === cardId);
    },

    save(log: ReviewLog): void {
        const logs = this.getAll();
        logs.push(log);
        Storage.set(STORAGE_KEYS.REVIEWS, logs);
    },

    clear(): void {
        Storage.set(STORAGE_KEYS.REVIEWS, []);
    },
};

// Утилиты Экспорта/Импорта
export const DataExport = {
    exportAll(): string {
        const data = {
            decks: DeckStorage.getAll(),
            cards: CardStorage.getAll(),
            reviews: ReviewStorage.getAll(),
            exportedAt: Date.now(),
        };
        return JSON.stringify(data, null, 2);
    },

    importAll(jsonString: string): boolean {
        try {
            const data = JSON.parse(jsonString);

            if (data.decks) Storage.set(STORAGE_KEYS.DECKS, data.decks);
            if (data.cards) Storage.set(STORAGE_KEYS.CARDS, data.cards);
            if (data.reviews) Storage.set(STORAGE_KEYS.REVIEWS, data.reviews);

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    clearAll(): void {
        Storage.clear();
    },
};
