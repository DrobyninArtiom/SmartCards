import { Plus, BookOpen, Trash2, Share, Download, Edit } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { useDeckActions, useDecks, useCards, useImportActions } from '../store/AppContext';
import { getDueCards } from '../lib/srs';
import { Modal, Button, Input, TextArea } from './ui';
import type { Deck, Card } from '../types';

export function DeckList() {
    const decks = useDecks();
    const allCards = useCards();
    const { createDeck, updateDeck, deleteDeck, setCurrentDeck } = useDeckActions();
    const { importDeck } = useImportActions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleOpenModal = (deck?: Deck) => {
        if (deck) {
            setEditingDeck(deck);
            setDeckName(deck.name);
            setDeckDescription(deck.description || '');
        } else {
            setEditingDeck(null);
            setDeckName('');
            setDeckDescription('');
        }
        setIsModalOpen(true);
    };

    const handleSaveDeck = () => {
        if (!deckName.trim()) return;

        if (editingDeck) {
            updateDeck({
                ...editingDeck,
                name: deckName,
                description: deckDescription || undefined
            });
        } else {
            createDeck(deckName, deckDescription || undefined);
        }

        setDeckName('');
        setDeckDescription('');
        setEditingDeck(null);
        setIsModalOpen(false);
    };

    const handleDeleteDeck = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Удалить набор и все карточки в нём?')) {
            deleteDeck(id);
        }
    };

    const handleExportDeck = (deck: Deck, e: React.MouseEvent) => {
        e.stopPropagation();
        const deckCards = allCards.filter(c => c.deckId === deck.id);
        const data = {
            deck,
            cards: deckCards
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${deck.name}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                const data = JSON.parse(json);
                if (data.deck && Array.isArray(data.cards)) {
                    importDeck(data.deck, data.cards);
                    // Reset input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                } else {
                    alert('Неверный формат файла');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Ошибка при чтении файла');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-smart-text">Мои Наборы</h1>

                <div className="flex gap-3">
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button variant="secondary" onClick={handleImportClick}>
                        <Download className="w-5 h-5 inline md:mr-2" />
                        <span className="hidden md:inline">Импорт</span>
                    </Button>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="w-5 h-5 inline md:mr-2" />
                        <span className="hidden md:inline">Создать набор</span>
                    </Button>
                </div>
            </div>

            {decks.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-smart-text-muted/50" />
                    <p className="text-smart-text-muted text-lg mb-6">
                        У вас пока нет наборов
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={handleImportClick}>
                            <Download className="w-5 h-5 inline md:mr-2" />
                            <span className="hidden md:inline">Импорт</span>
                        </Button>
                        <Button onClick={() => handleOpenModal()}>
                            <Plus className="w-5 h-5 inline md:mr-2" />
                            <span className="hidden md:inline">Создать первый набор</span>
                        </Button>
                    </div>
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
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(deck);
                                            }}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                            title="Редактировать"
                                        >
                                            <Edit className="w-4 h-4 text-smart-text-muted" />
                                        </button>
                                        <button
                                            onClick={(e) => handleExportDeck(deck, e)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                            title="Экспорт"
                                        >
                                            <Share className="w-4 h-4 text-smart-text-muted" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteDeck(deck.id, e)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Удалить"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
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
                title={editingDeck ? "Редактировать набор" : "Создать новый набор"}
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
                        <Button onClick={handleSaveDeck} disabled={!deckName.trim()}>
                            {editingDeck ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
