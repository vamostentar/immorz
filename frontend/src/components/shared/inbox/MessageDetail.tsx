import { Message, MessageStatus } from '@/types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
    Calendar,
    Eye,
    EyeOff,
    Loader2,
    Mail,
    MapPin,
    Paperclip,
    Phone,
    RotateCcw,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { AttachmentList } from './AttachmentList';
import { MessageThread } from './MessageThread';
import { ReplyBox } from './ReplyBox';

interface MessageDetailProps {
    message: Message;
    activeTab: 'all' | 'received' | 'sent' | 'trash';
    onClose: () => void;
    onDelete: (id: string, permanent: boolean) => Promise<void>;
    onRestore: (id: string) => Promise<void>;
    onMarkUnread: (id: string) => Promise<void>;
    onReply: (id: string, text: string, recipient: string, files: (File | { id: string; file: File })[]) => Promise<boolean | void>;
    isLoadingAction: boolean;
}

export function MessageDetail({
    message,
    activeTab,
    onClose,
    onDelete,
    onRestore,
    onMarkUnread,
    onReply,
    isLoadingAction
}: MessageDetailProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(f => ({
                id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file: f
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }
        e.target.value = '';
    };

    const handleRemoveFile = (id: string | number) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setIsUploading(true);
        try {
            const fileList = files.map(f => f.file);
            const success = await onReply(message.id, replyText, message.fromEmail, fileList);
            
            // If onReply returns boolean true, or if it returns void (undefined) and didn't throw
            if (success === true || success === undefined) {
                setReplyText('');
                setFiles([]);
            }
        } catch (error: any) {
            // Parent handles error notification
        } finally {
            setIsUploading(false);
        }
    };

    const handleConfirmDelete = async () => {
        await onDelete(message.id, activeTab === 'trash');
        setShowDeleteConfirm(false);
    };

    const getStatusColor = (status: MessageStatus) => {
        switch (status) {
            case 'RECEIVED': return 'bg-blue-100 text-blue-800';
            case 'QUEUED': return 'bg-yellow-100 text-yellow-800';
            case 'SENT': return 'bg-green-100 text-green-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white min-w-0">
             {/* Toolbar */}
             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10 w-full">
                <button
                    onClick={onClose}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                >
                    ← Voltar
                </button>
                <div className="flex gap-2 ml-auto">
                    {activeTab === 'trash' && (
                        <button
                            onClick={() => onRestore(message.id)}
                            disabled={isLoadingAction}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50"
                            title="Restaurar"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    )}

                    {message.read && activeTab !== 'trash' ? (
                        <button
                            onClick={() => onMarkUnread(message.id)}
                            disabled={isLoadingAction}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                            title="Marcar como não lido"
                        >
                            <EyeOff className="w-5 h-5" />
                        </button>
                    ) : !message.read && (
                        <span className="p-2 text-green-500" title="Não lido">
                            <Eye className="w-5 h-5" />
                        </span>
                    )}
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title={activeTab === 'trash' ? "Eliminar permanentemente" : "Mover para o lixo"}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {activeTab === 'trash' ? 'Eliminar Permanentemente' : 'Mover para o Lixo'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {activeTab === 'trash'
                                ? 'Tem a certeza que deseja eliminar esta mensagem permanentemente? Esta ação NÃO pode ser revertida.'
                                : 'Tem a certeza que deseja mover esta mensagem para o lixo?'}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isLoadingAction}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md transition-colors flex items-center gap-2"
                            >
                                {isLoadingAction ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        A eliminar...
                                    </>
                                ) : (
                                    activeTab === 'trash' ? 'Eliminar para sempre' : 'Eliminar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {/* Header Info */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {message.context?.reason || "Mensagem de Contacto"}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(message.status)}`}>
                            {message.status}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {message.type === 'OUTBOUND'
                                    ? 'R'
                                    : message.fromName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                    {message.type === 'OUTBOUND' ? 'Ribeira Azul' : message.fromName}
                                </div>
                                <div className="text-sm text-blue-600 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {message.type === 'OUTBOUND' ? (
                                        <span>Para: <a href={`mailto:${message.context?.toEmail || message.context?.replyTo}`} className="hover:underline">{message.context?.toEmail || message.context?.replyTo}</a></span>
                                    ) : (
                                        <a href={`mailto:${message.fromEmail}`} className="hover:underline">{message.fromEmail}</a>
                                    )}
                                </div>
                                {message.phone && (
                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                        <Phone className="w-3 h-3" />
                                        <a href={`tel:${message.phone}`}>{message.phone}</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm text-gray-500 ml-auto text-right">
                            <div className="flex items-center gap-1 justify-end">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(message.createdAt), 'PPP p', { locale: pt })}
                            </div>
                            {message.propertyId && (
                                <div className="flex items-center gap-1 justify-end text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                    <MapPin className="w-3 h-3" />
                                    Ref. ID: {message.propertyId.substring(0, 8)}...
                                </div>
                            )}
                        </div>
                    </div>

                    <MessageThread messageId={message.id} originalBody={message.body} />

                    {/* Attachments Section */}
                    {message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Paperclip className="w-4 h-4" />
                                Anexos ({message.attachments.length})
                            </h3>
                            <AttachmentList attachments={message.attachments} readonly />
                        </div>
                    )}
                </div>

                {/* Reply Box */}
                <ReplyBox 
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onSend={handleSendReply}
                    isPending={isLoadingAction}
                    isUploading={isUploading}
                    files={files}
                    onFileSelect={handleFileSelect}
                    onRemoveFile={handleRemoveFile}
                />

                {/* Context Info (if available) */}

            </div>
        </div>
    );
}
