import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './ui';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-smart-bg p-4">
                    <div className="bg-neutral-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-white/5">
                        <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Что-то пошло не так
                        </h1>
                        <p className="text-smart-text-muted mb-6">
                            Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
                        </p>

                        {this.state.error && (
                            <div className="bg-black/30 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
                                <code className="text-xs text-red-300 font-mono">
                                    {this.state.error.message}
                                </code>
                            </div>
                        )}

                        <Button onClick={this.handleReload} className="w-full justify-center">
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Перезагрузить страницу
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
