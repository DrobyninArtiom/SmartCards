import { useState } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import type { Card } from '../types';
import { useCardActions, useCurrentDeck, useDeckActions } from '../store/AppContext';

import { Flashcard } from './Flashcard';
import { Button } from './ui';
import type { CardRating } from '../types';

interface StudySessionProps {
    cards: Card[];
    onExit?: () => void;
}

export function StudySession({ cards, onExit }: StudySessionProps) {
    const currentDeck = useCurrentDeck();
    const { setCurrentDeck } = useDeckActions();
    const { reviewCard } = useCardActions();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(cards.length === 0);
    const [reviewedCount, setReviewedCount] = useState(0);

    const handleRate = (rating: CardRating) => {
        const currentCard = cards[currentIndex];
        if (!currentCard) return;

        // Записать повторение
        reviewCard(currentCard.id, rating, 0); // timeSpent можно отслеживать позже
        setReviewedCount(prev => prev + 1);

        // Переход к следующей карточке
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleExit = () => {
        if (onExit) {
            onExit();
        } else {
            setCurrentDeck(null);
        }
    };

    if (!currentDeck) return null;

    // Экран завершения
    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8">
                <Trophy className="w-24 h-24 text-emerald-400 mb-6" />
                <h1 className="text-4xl font-bold text-smart-text mb-4">
                    Сессия завершена!
                </h1>
                <p className="text-xl text-smart-text-muted mb-8">
                    Вы повторили <span className="text-emerald-400 font-semibold">{reviewedCount}</span> карточек
                </p>
                <div className="flex gap-4">
                    <Button variant="secondary" onClick={handleExit}>
                        <ArrowLeft className="w-5 h-5 inline mr-2" />
                        Вернуться к набору
                    </Button>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];
    if (!currentCard) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8">
                <p className="text-smart-text-muted text-xl mb-8">
                    Нет карточек для повторения
                </p>
                <Button onClick={handleExit}>
                    <ArrowLeft className="w-5 h-5 inline mr-2" />
                    Вернуться к набору
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Заголовок */}
            <div className="p-6 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handleExit}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-smart-text" />
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold text-emerald-400">{currentDeck.name}</h2>
                        {currentDeck.description && (
                            <p className="text-sm text-smart-text-muted mt-1">{currentDeck.description}</p>
                        )}
                    </div>
                    <div className="w-10" /> {/* Распорка для центрирования */}
                </div>
            </div>

            {/* Карточка */}
            <Flashcard
                card={currentCard}
                onRate={handleRate}
                remainingCards={cards.length - currentIndex}
            />
        </div>
    );
}
