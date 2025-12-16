import type { ReactNode } from 'react';
import { useReducer, useEffect } from 'react';
import { AppContext, appReducer, initialState } from './AppContext';
import { DeckStorage, CardStorage, ReviewStorage, SettingsStorage } from '../lib/storage';
import { DEFAULT_SRS_SETTINGS } from '../lib/srs';

// Провайдер
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Загрузка данных из localStorage при монтировании
    useEffect(() => {
        const decks = DeckStorage.getAll();
        const cards = CardStorage.getAll();
        const reviews = ReviewStorage.getAll();
        const settings = SettingsStorage.get() || DEFAULT_SRS_SETTINGS;
        dispatch({ type: 'LOAD_DATA', payload: { decks, cards, reviews, settings } });
    }, []);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}
