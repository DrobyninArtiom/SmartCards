import { createContext, useContext, useMemo } from 'react';
import type { Card, Deck, ReviewLog, CardRating, SRSSettings } from '../types';
import { DeckStorage, CardStorage, ReviewStorage, SettingsStorage } from '../lib/storage';
import { calculateNextReview, createNewCard, DEFAULT_SRS_SETTINGS } from '../lib/srs';
import { generateId } from '../lib/utils';

// Структура состояния
export interface AppState {
    decks: Deck[];
    cards: Card[];
    reviews: ReviewLog[];
    currentDeckId: string | null;
    settings: SRSSettings;
}

// Типы действий
export type Action =
    | { type: 'LOAD_DATA'; payload: { decks: Deck[]; cards: Card[]; reviews: ReviewLog[]; settings: SRSSettings } }
    | { type: 'ADD_DECK'; payload: Deck }
    | { type: 'UPDATE_DECK'; payload: Deck }
    | { type: 'DELETE_DECK'; payload: string }
    | { type: 'ADD_CARD'; payload: Card }
    | { type: 'UPDATE_CARD'; payload: Card }
    | { type: 'DELETE_CARD'; payload: string }
    | { type: 'REVIEW_CARD'; payload: { cardId: string; rating: CardRating; timeSpent: number } }
    | { type: 'SET_CURRENT_DECK'; payload: string | null }
    | { type: 'IMPORT_DECK'; payload: { deck: Deck; cards: Card[] } }
    | { type: 'UPDATE_SETTINGS'; payload: SRSSettings };

// Начальное состояние
export const initialState: AppState = {
    decks: [],
    cards: [],
    reviews: [],
    currentDeckId: null,
    settings: DEFAULT_SRS_SETTINGS,
};

// Редьюсер
export function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'LOAD_DATA':
            return {
                ...state,
                decks: action.payload.decks,
                cards: action.payload.cards,
                reviews: action.payload.reviews,
                settings: action.payload.settings,
            };

        case 'ADD_DECK':
            DeckStorage.save(action.payload);
            return {
                ...state,
                decks: [...state.decks, action.payload],
            };

        case 'UPDATE_DECK':
            DeckStorage.save(action.payload);
            return {
                ...state,
                decks: state.decks.map(deck =>
                    deck.id === action.payload.id ? action.payload : deck
                ),
            };

        case 'DELETE_DECK':
            DeckStorage.delete(action.payload);
            CardStorage.deleteByDeckId(action.payload);
            return {
                ...state,
                decks: state.decks.filter(deck => deck.id !== action.payload),
                cards: state.cards.filter(card => card.deckId !== action.payload),
                currentDeckId: state.currentDeckId === action.payload ? null : state.currentDeckId,
            };

        case 'ADD_CARD':
            CardStorage.save(action.payload);
            return {
                ...state,
                cards: [...state.cards, action.payload],
            };

        case 'UPDATE_CARD':
            CardStorage.save(action.payload);
            return {
                ...state,
                cards: state.cards.map(card =>
                    card.id === action.payload.id ? action.payload : card
                ),
            };

        case 'DELETE_CARD':
            CardStorage.delete(action.payload);
            return {
                ...state,
                cards: state.cards.filter(card => card.id !== action.payload),
            };

        case 'REVIEW_CARD': {
            const card = state.cards.find(c => c.id === action.payload.cardId);
            if (!card) return state;

            const updates = calculateNextReview(card, action.payload.rating, state.settings);
            const updatedCard = { ...card, ...updates };
            CardStorage.save(updatedCard);

            const reviewLog: ReviewLog = {
                id: generateId(),
                cardId: action.payload.cardId,
                reviewedAt: Date.now(),
                rating: action.payload.rating,
                timeSpent: action.payload.timeSpent,
            };
            ReviewStorage.save(reviewLog);

            return {
                ...state,
                cards: state.cards.map(c => (c.id === updatedCard.id ? updatedCard : c)),
                reviews: [...state.reviews, reviewLog],
            };
        }

        case 'SET_CURRENT_DECK':
            return {
                ...state,
                currentDeckId: action.payload,
            };

        case 'IMPORT_DECK': {
            const { deck, cards } = action.payload;

            // Generate new IDs to prevent conflicts
            const newDeckId = generateId();
            const newDeck: Deck = {
                ...deck,
                id: newDeckId,
                createdAt: Date.now(), // Reset created date for import
            };

            const newCards: Card[] = cards.map(card => ({
                ...card,
                id: generateId(),
                deckId: newDeckId,
                createdAt: Date.now(),
            }));

            DeckStorage.save(newDeck);
            newCards.forEach(card => CardStorage.save(card));

            return {
                ...state,
                decks: [...state.decks, newDeck],
                cards: [...state.cards, ...newCards],
            };
        }

        case 'UPDATE_SETTINGS':
            SettingsStorage.save(action.payload);
            return {
                ...state,
                settings: action.payload,
            };

        default:
            return state;
    }
}

// Контекст
export const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<Action>;
} | null>(null);

// Хук для использования контекста
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

// Набор хуков
export function useDecks() {
    const { state } = useApp();
    return state.decks;
}

export function useCards(deckId?: string) {
    const { state } = useApp();
    return useMemo(() => {
        if (deckId) {
            return state.cards.filter(card => card.deckId === deckId);
        }
        return state.cards;
    }, [state.cards, deckId]);
}

export function useCurrentDeck() {
    const { state } = useApp();
    return useMemo(() => {
        return state.decks.find(deck => deck.id === state.currentDeckId) || null;
    }, [state.decks, state.currentDeckId]);
}

export function useDeckActions() {
    const { dispatch } = useApp();

    return {
        createDeck: (name: string, description?: string, color?: string) => {
            const deck: Deck = {
                id: generateId(),
                name,
                description,
                color,
                createdAt: Date.now(),
            };
            dispatch({ type: 'ADD_DECK', payload: deck });
            return deck;
        },

        updateDeck: (deck: Deck) => {
            dispatch({ type: 'UPDATE_DECK', payload: deck });
        },

        deleteDeck: (id: string) => {
            dispatch({ type: 'DELETE_DECK', payload: id });
        },

        setCurrentDeck: (id: string | null) => {
            dispatch({ type: 'SET_CURRENT_DECK', payload: id });
        },
    };
}

export function useCardActions() {
    const { dispatch } = useApp();

    return {
        createCard: (deckId: string, front: string, back: string) => {
            const card = createNewCard(deckId, front, back);
            dispatch({ type: 'ADD_CARD', payload: card });
            return card;
        },

        updateCard: (card: Card) => {
            dispatch({ type: 'UPDATE_CARD', payload: card });
        },

        deleteCard: (id: string) => {
            dispatch({ type: 'DELETE_CARD', payload: id });
        },

        reviewCard: (cardId: string, rating: CardRating, timeSpent: number) => {
            dispatch({ type: 'REVIEW_CARD', payload: { cardId, rating, timeSpent } });
        },
    };
}

export function useImportActions() {
    const { dispatch } = useApp();

    return {
        importDeck: (deck: Deck, cards: Card[]) => {
            dispatch({ type: 'IMPORT_DECK', payload: { deck, cards } });
        }
    };
}

export function useSettings() {
    const { state, dispatch } = useApp();

    return {
        settings: state.settings,
        updateSettings: (settings: SRSSettings) => {
            dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
        }
    };
}
