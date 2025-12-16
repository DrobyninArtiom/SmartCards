import { useState } from 'react';
import { useSettings } from '../store/AppContext';
import { Modal, Button, Input } from './ui';
import type { SRSSettings } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { settings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState<SRSSettings>(settings);



    const handleChange = (key: keyof SRSSettings, value: string) => {
        const numValue = parseFloat(value);
        setLocalSettings(prev => ({
            ...prev,
            [key]: isNaN(numValue) ? 0 : numValue,
        }));
    };

    const handleSave = () => {
        updateSettings(localSettings);
        onClose();
    };

    const handleReset = () => {
        setLocalSettings({
            againDelayMinutes: 10,
            hardMultiplier: 1.2,
            goodMultiplier: 2.5,
            easyMultiplier: 3.0,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Настройки алгоритма">
            <div className="space-y-4">
                <div className="mb-4 text-sm text-smart-text-muted">
                    <p>Настройки влияют на расчет следующих интервалов повторения (SM-2).</p>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Задержка 'Повтор' (минуты)"
                        type="number"
                        step="1"
                        min="1"
                        value={localSettings.againDelayMinutes}
                        onChange={(e) => handleChange('againDelayMinutes', e.target.value)}
                    />
                    <Input
                        label="Множитель 'Трудно'"
                        type="number"
                        step="0.1"
                        min="1.0"
                        value={localSettings.hardMultiplier}
                        onChange={(e) => handleChange('hardMultiplier', e.target.value)}
                    />
                    <Input
                        label="Множитель 'Нормально'"
                        type="number"
                        step="0.1"
                        min="1.1"
                        value={localSettings.goodMultiplier}
                        onChange={(e) => handleChange('goodMultiplier', e.target.value)}
                    />
                    <Input
                        label="Множитель 'Легко'"
                        type="number"
                        step="0.1"
                        min="1.3"
                        value={localSettings.easyMultiplier}
                        onChange={(e) => handleChange('easyMultiplier', e.target.value)}
                    />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <Button variant="danger" onClick={handleReset} className="mr-auto">
                        Сбросить
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button onClick={handleSave}>
                        Сохранить
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
