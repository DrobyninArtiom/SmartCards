import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-neutral-800 z-10 sticky top-0">
                    <h2 className="text-xl font-semibold text-smart-text">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-smart-text-muted" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
            </div>
        </div>
    );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
    const baseStyles = 'px-4 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-emerald-400 text-white hover:bg-emerald-500',
        secondary: 'bg-white/5 text-smart-text hover:bg-white/10',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-smart-text-muted">
                    {label}
                </label>
            )}
            <input
                className={`px-4 py-3 bg-white/5 rounded-lg text-smart-text placeholder:text-smart-text-muted/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${className}`}
                {...props}
            />
        </div>
    );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export function TextArea({ label, className = '', ...props }: TextAreaProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-smart-text-muted">
                    {label}
                </label>
            )}
            <textarea
                className={`px-4 py-3 bg-white/5 rounded-lg text-smart-text placeholder:text-smart-text-muted/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all resize-none ${className}`}
                {...props}
            />
        </div>
    );
}
