import { useState } from 'react';
import { RotateCcw, Brain, Check, Zap } from 'lucide-react';
import type { Card, CardRating } from '../types';
import { Button } from './ui';

interface FlashcardProps {
    card: Card;
    onRate: (rating: CardRating) => void;
    remainingCards: number;
}

export function Flashcard({ card, onRate, remainingCards }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleRate = (rating: CardRating) => {
        onRate(rating);
        setIsFlipped(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
            {/* Индикатор прогресса */}
            <div className="mb-8 text-center">
                <p className="text-smart-text-muted">
                    Осталось карточек: <span className="text-emerald-400 font-semibold">{remainingCards}</span>
                </p>
            </div>

            {/* Карточка */}
            <div
                className="relative w-full max-w-2xl h-96 cursor-pointer perspective-1000"
                onClick={handleFlip}
            >
                <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                        }`}
                >
                    {/* Лицевая сторона */}
                    <div className="absolute w-full h-full backface-hidden">
                        <div className="w-full h-full bg-white/5 rounded-2xl p-8 flex flex-col items-center justify-center border-2 border-emerald-400/30 hover:border-emerald-400/50 transition-colors shadow-xl">
                            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide mb-4">
                                Вопрос
                            </p>
                            <p className="text-2xl text-smart-text text-center">{card.front}</p>
                            <p className="text-sm text-white/30 mt-8">
                                Нажмите, чтобы увидеть ответ
                            </p>
                        </div>
                    </div>

                    {/* Обратная сторона */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180">
                        <div className="w-full h-full bg-white/5 rounded-2xl p-8 flex flex-col items-center justify-center border-2 border-emerald-400/30 shadow-xl">
                            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide mb-4">
                                Ответ
                            </p>
                            <p className="text-2xl text-smart-text text-center mb-8">{card.back}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопки оценки - показывать только когда карточка перевернута */}
            {isFlipped && (
                <div className="mt-8 flex flex-col md:flex-row gap-3 w-full md:w-auto animate-in fade-in duration-300">
                    <Button
                        onClick={() => handleRate('again')}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white w-full md:w-auto"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Повтор
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleRate('hard')}
                        className="flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <Brain className="w-4 h-4" />
                        Трудно
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleRate('good')}
                        className="flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <Check className="w-4 h-4" />
                        Нормально
                    </Button>
                    <Button
                        onClick={() => handleRate('easy')}
                        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 w-full md:w-auto"
                    >
                        <Zap className="w-4 h-4" />
                        Легко
                    </Button>
                </div>
            )}
        </div>
    );
}
