import { AlertCircle, CheckCircle, Loader2, X, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (notes: string) => Promise<void>;
    type: 'approve' | 'reject';
    title: string;
    description?: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    type,
    title,
    description
}) => {
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (type === 'reject' && !notes.trim()) {
            setError('O motivo da rejeição é obrigatório.');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            await onConfirm(notes);
            setNotes('');
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Ocorreu um erro ao processar a ação.');
        } finally {
            setIsLoading(false);
        }
    };

    const isApprove = type === 'approve';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isApprove ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {isApprove ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {isApprove ? 'Aprovar Pedido' : 'Rejeitar Pedido'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{title}</p>
                        {description && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{description}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Notas do Revisor {type === 'reject' && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => {
                                setNotes(e.target.value);
                                if (error) setError(null);
                            }}
                            className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                            placeholder={isApprove ? "Adicione observações (opcional)..." : "Explique o motivo da rejeição..."}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900/30">
                            <AlertCircle size={16} className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                                isApprove 
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-none' 
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none'
                            } disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                isApprove ? 'Aprovar' : 'Rejeitar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
