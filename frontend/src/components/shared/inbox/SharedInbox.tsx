import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useInbox } from '@/hooks/useInbox';
import { useMessageActions } from '@/hooks/useMessageActions';
import { Message } from '@/types';
import { useState } from 'react';
import { ComposeModal } from './ComposeModal';
import { InboxSidebar } from './InboxSidebar';
import { MessageDetail } from './MessageDetail';

export interface SharedInboxProps {
    mode: 'admin' | 'agent';
}

export function SharedInbox({ mode }: SharedInboxProps) {
    // Use modular hooks for state and actions
    const {
        selectedMessage,
        isComposing,
        activeTab,
        filters,
        messagesData,
        stats,
        isLoading,
        setSelectedMessage,
        setIsComposing,
        setActiveTab,
        setFilters,
        refetch
    } = useInbox({ mode });

    const {
        markAsRead,
        markAsUnread,
        deleteMessage,
        restoreMessage,
        sendReply,
        sendMessage,
        isLoading: isLoadingAction
    } = useMessageActions();

    const handleSelectMessage = async (message: Message) => {
        setSelectedMessage(message);

        // Mark as read when selecting (only if not in trash and not already read)
        if (!message.read && activeTab !== 'trash') {
            await markAsRead(message.id);
        }
    };

    const [dialogState, setDialogState] = useState<{
        open: boolean;
        title: string;
        message: string;
        variant: 'success' | 'danger' | 'primary';
    }>({
        open: false,
        title: '',
        message: '',
        variant: 'primary'
    });

    const handleSendMessage = async (data: { toEmail: string; subject: string; body: string; files: File[] }) => {
        try {
            await sendMessage(data);
            setIsComposing(false);
            setDialogState({
                open: true,
                title: 'Mensagem Enviada',
                message: 'A sua mensagem foi enviada com sucesso.',
                variant: 'success'
            });
            refetch();
        } catch (error: any) {
            setDialogState({
                open: true,
                title: 'Erro ao Enviar',
                message: error.message || 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.',
                variant: 'danger'
            });
        }
    };

    const handleSendReply = async (messageId: string, replyText: string, recipientEmail: string, files: (File | { id: string; file: File })[]): Promise<boolean> => {
        // useMessageActions handles File[] currently, so we extract just the files if needed
        // but sendMessage/sendReply in useMessageActions expect File[]
        const fileList = files.map(f => 'file' in f ? f.file : f);
        try {
            await sendReply(messageId, replyText, recipientEmail, fileList);
            setDialogState({
                open: true,
                title: 'Resposta Enviada',
                message: 'A sua resposta foi enviada com sucesso.',
                variant: 'success'
            });
            refetch();
            return true;
        } catch (error: any) {
             setDialogState({
                open: true,
                title: 'Erro ao Responder',
                message: error.message || 'Ocorreu um erro ao enviar a resposta. Por favor, tente novamente.',
                variant: 'danger'
            });
            return false;
        }
    };

    const handleDelete = async (id: string, permanent: boolean) => {
        try {
            await deleteMessage(id, permanent);
            setSelectedMessage(null);
            refetch();
        } catch (error: any) {
            setDialogState({
                open: true,
                title: 'Erro ao Eliminar',
                message: error.message || 'Ocorreu um erro ao eliminar a mensagem.',
                variant: 'danger'
            });
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await restoreMessage(id);
            setSelectedMessage(null);
            refetch();
        } catch (error: any) {
            setDialogState({
                open: true,
                title: 'Erro ao Restaurar',
                message: error.message || 'Ocorreu um erro ao restaurar a mensagem.',
                variant: 'danger'
            });
        }
    };

    const handleMarkUnread = async (id: string) => {
        try {
            await markAsUnread(id);
            setSelectedMessage(null);
            refetch();
        } catch (error: any) {
            setDialogState({
                open: true,
                title: 'Erro ao Marcar como Não Lido',
                message: error.message || 'Ocorreu um erro ao marcar a mensagem como não lida.',
                variant: 'danger'
            });
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            {/* Left Sidebar - Message List */}
            <InboxSidebar
                stats={stats ? { unread: stats.unread ?? 0, total: stats.total ?? 0 } : undefined}
                filters={filters}
                setFilters={setFilters}
                refetch={refetch}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                messagesData={messagesData}
                isLoading={isLoading}
                selectedMessage={selectedMessage}
                onSelectMessage={handleSelectMessage}
                onCompose={() => setIsComposing(true)}
            />

            {/* Right Panel - Message Details */}
            {selectedMessage ? (
                <MessageDetail
                    message={selectedMessage}
                    activeTab={activeTab}
                    onClose={() => setSelectedMessage(null)}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    onMarkUnread={handleMarkUnread}
                    onReply={handleSendReply}
                    isLoadingAction={isLoadingAction}
                />
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center h-full text-gray-400">
                    <div className="w-16 h-16 mb-4 opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <p className="text-lg">Selecione uma mensagem para ler</p>
                </div>
            )}

            {/* Compose Modal */}
            {isComposing && (
                <ComposeModal
                    onClose={() => setIsComposing(false)}
                    onSend={handleSendMessage}
                    isSending={isLoadingAction}
                />
            )}

            {/* Notification Dialog */}
            <ConfirmDialog
                open={dialogState.open}
                title={dialogState.title}
                message={dialogState.message}
                variant={dialogState.variant}
                confirmLabel="OK"
                showCancel={false}
                onConfirm={() => setDialogState(prev => ({ ...prev, open: false }))}
                onCancel={() => setDialogState(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
}
