import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useDeckActions, useDecks, useCards } from '../store/AppContext';
import { getDueCards } from '../lib/srs';
import { Modal, Button, Input, TextArea } from './ui';

export function DeckList() {
    const decks = useDecks();
    const allCards = useCards();
    const { createDeck, deleteDeck, setCurrentDeck } = useDeckActions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');

    // Рассчитать статистику для каждого набора
    const deckStats = useMemo(() => {
        const stats: Record<string, { total: number; due: number }> = {};
        decks.forEach(deck => {
            const deckCards = allCards.filter(c => c.deckId === deck.id);
            const dueCards = getDueCards(deckCards);
            stats[deck.id] = {
                total: deckCards.length,
                due: dueCards.length
            };
        });
        return stats;
    }, [decks, allCards]);

    const handleCreateDeck = () => {
        if (!deckName.trim()) return;

        createDeck(deckName, deckDescription || undefined);
        setDeckName('');
        setDeckDescription('');
        setIsModalOpen(false);
    };

    const handleDeleteDeck = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Удалить набор и все карточки в нём?')) {
            deleteDeck(id);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-smart-text">Мои Наборы</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-5 h-5 inline mr-2" />
                    Создать набор
                </Button>
            </div>

            {decks.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-smart-text-muted/50" />
                    <p className="text-smart-text-muted text-lg mb-6">
                        У вас пока нет наборов
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                        Создать первый набор
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {decks.map((deck) => {
                        const stats = deckStats[deck.id] || { total: 0, due: 0 };

                        return (
                            <div
                                key={deck.id}
                                onClick={() => setCurrentDeck(deck.id)}
                                className="bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all cursor-pointer group flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-emerald-400">
                                        {deck.name}
                                    </h3>
                                    <button
                                        onClick={(e) => handleDeleteDeck(deck.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                                {deck.description && (
                                    <p className="text-sm text-smart-text-muted line-clamp-2 mb-4">
                                        {deck.description}
                                    </p>
                                )}
                                <div className="mt-auto flex items-center justify-between">
                                    <p className="text-xs text-white/30">
                                        {stats.total === 0 ? 'В наборе нет карточек' : `Всего карточек: ${stats.total}`}
                                    </p>
                                    {stats.due > 0 && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                                            Доступно: {stats.due}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Создать новый набор"
            >
                <div className="space-y-4">
                    <Input
                        label="Название"
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                        placeholder="Например: Английский язык"
                        autoFocus
                    />
                    <TextArea
                        label="Описание (опционально)"
                        value={deckDescription}
                        onChange={(e) => setDeckDescription(e.target.value)}
                        placeholder="Краткое описание набора"
                        rows={3}
                    />
                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleCreateDeck} disabled={!deckName.trim()}>
                            Создать
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
