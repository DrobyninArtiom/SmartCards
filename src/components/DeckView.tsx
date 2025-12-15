import { ArrowLeft, Plus, Edit, Trash2, Play } from 'lucide-react';
import { useState } from 'react';
import type { Card } from '../types';
import { useCardActions, useCards, useCurrentDeck, useDeckActions } from '../store/AppContext';
import { Modal, Button, TextArea } from './ui';
import { getDueCards } from '../lib/srs';
import { StudySession } from './StudySession';

export function DeckView() {
    const currentDeck = useCurrentDeck();
    const cards = useCards(currentDeck?.id);
    const { setCurrentDeck } = useDeckActions();
    const { createCard, deleteCard, updateCard } = useCardActions();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [cardFront, setCardFront] = useState('');
    const [cardBack, setCardBack] = useState('');
    const [isStudying, setIsStudying] = useState(false);

    if (!currentDeck) return null;

    const handleOpenModal = (card?: Card) => {
        if (card) {
            setEditingCard(card);
            setCardFront(card.front);
            setCardBack(card.back);
        } else {
            setEditingCard(null);
            setCardFront('');
            setCardBack('');
        }
        setIsModalOpen(true);
    };

    const handleSaveCard = () => {
        if (!cardFront.trim() || !cardBack.trim()) return;

        if (editingCard) {
            updateCard({ ...editingCard, front: cardFront, back: cardBack });
        } else {
            createCard(currentDeck.id, cardFront, cardBack);
        }

        setCardFront('');
        setCardBack('');
        setEditingCard(null);
        setIsModalOpen(false);
    };

    const handleDeleteCard = (id: string) => {
        if (confirm('Удалить карточку?')) {
            deleteCard(id);
        }
    };

    const handleStartStudy = () => {
        setIsStudying(true);
    };

    if (isStudying) {
        return <StudySession onExit={() => setIsStudying(false)} />;
    }

    const dueCards = getDueCards(cards);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setCurrentDeck(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-smart-text" />
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-emerald-400">{currentDeck.name}</h1>
                    {currentDeck.description && (
                        <p className="text-smart-text-muted mt-1">{currentDeck.description}</p>
                    )}
                </div>
                <div className="flex gap-3">
                    {dueCards.length > 0 && (
                        <Button onClick={handleStartStudy} className="bg-emerald-500 hover:bg-emerald-600">
                            <Play className="w-5 h-5 inline md:mr-2" />
                            <span className="hidden md:inline">Повторить ({dueCards.length})</span>
                        </Button>
                    )}
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="w-5 h-5 inline md:mr-2" />
                        <span className="hidden md:inline">Добавить карточку</span>
                    </Button>
                </div>
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-white/30 text-lg mb-6">
                        В этом наборе пока нет карточек
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="bg-white/5 hover:bg-white/10 rounded-xl p-5 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                                    Вопрос
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(card)}
                                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-smart-text-muted" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCard(card.id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-smart-text mb-5 line-clamp-3">{card.front}</p>
                            <div className="border-t border-white/5 pt-4">
                                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                                    Ответ
                                </span>
                                <p className="text-smart-text-muted mt-2 line-clamp-2">{card.back}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCard ? 'Редактировать карточку' : 'Создать карточку'}
            >
                <div className="space-y-4">
                    <TextArea
                        label="Вопрос"
                        value={cardFront}
                        onChange={(e) => setCardFront(e.target.value)}
                        placeholder="Введите вопрос"
                        rows={3}
                        autoFocus
                    />
                    <TextArea
                        label="Ответ"
                        value={cardBack}
                        onChange={(e) => setCardBack(e.target.value)}
                        placeholder="Введите ответ"
                        rows={3}
                    />
                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSaveCard}
                            disabled={!cardFront.trim() || !cardBack.trim()}
                        >
                            {editingCard ? 'Сохранить' : 'Создать'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
