import { api } from '@/api/client';
import {
    useCreateMessage,
    useDeleteMessage,
    useMarkMessageAsRead,
    useMarkMessageAsUnread,
    usePermanentlyDeleteMessage,
    useReplyToMessage,
    useRestoreMessage
} from '@/api/queries';

export function useMessageActions() {
    const replyMutation = useReplyToMessage();
    const markAsReadMutation = useMarkMessageAsRead();
    const markAsUnreadMutation = useMarkMessageAsUnread();
    const deleteMutation = useDeleteMessage();
    const permanentlyDeleteMutation = usePermanentlyDeleteMessage();
    const restoreMutation = useRestoreMessage();
    const createMessageMutation = useCreateMessage();

    const uploadFiles = async (files: File[]) => {
        const uploadedAttachments = [];
        console.log(`[useMessageActions] Iniciando upload de ${files.length} ficheiros`);
        
        for (const [index, file] of files.entries()) {
            console.log(`[useMessageActions] A carregar ficheiro ${index + 1}/${files.length}: ${file.name} (${file.size} bytes)`);
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Let Axios and the Browser handle the boundary for multipart/form-data automatically
                const { data: result } = await api.post('/api/v1/media/upload/document?bucket=email-attachments', formData);

                if (result.success) {
                    console.log(`[useMessageActions] Sucesso no upload: ${file.name} -> ${result.data.url}`);
                    uploadedAttachments.push({
                        name: file.name,
                        url: result.data.url,
                        type: file.type,
                        size: file.size
                    });
                } else {
                    console.error(`[useMessageActions] Falha na resposta do servidor para ${file.name}:`, result);
                    throw new Error(`Erro ao carregar ficheiro: ${result.message || 'Erro desconhecido'}`);
                }
            } catch (error: any) {
                console.error(`[useMessageActions] Erro de rede ou servidor ao carregar ${file.name}:`, error);
                throw error;
            }
        }
        console.log('[useMessageActions] Todos os uploads concluídos com sucesso:', uploadedAttachments);
        return uploadedAttachments;
    };

    const markAsRead = async (messageId: string) => {
        try {
            await markAsReadMutation.mutateAsync(messageId);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAsUnread = async (messageId: string) => {
        try {
            await markAsUnreadMutation.mutateAsync(messageId);
        } catch (error) {
            console.error('Failed to mark as unread:', error);
        }
    };

    const deleteMessage = async (messageId: string, isPermanent: boolean = false) => {
        if (isPermanent) {
            await permanentlyDeleteMutation.mutateAsync(messageId);
        } else {
            await deleteMutation.mutateAsync(messageId);
        }
    };

    const restoreMessage = async (messageId: string) => {
        await restoreMutation.mutateAsync(messageId);
    };

    const sendReply = async (messageId: string, replyText: string, recipientEmail: string, files: File[]) => {
        let attachments: { name: string; url: string; type: string; size: number }[] = [];
        if (files.length > 0) {
            attachments = await uploadFiles(files);
        }

        await replyMutation.mutateAsync({
            messageId,
            body: replyText,
            toEmail: recipientEmail,
            attachments
        });
    };

    const sendMessage = async (data: { toEmail: string; subject: string; body: string; files: File[] }) => {
        let attachments: { name: string; url: string; type: string; size: number }[] = [];
        if (data.files.length > 0) {
            attachments = await uploadFiles(data.files);
        }

        await createMessageMutation.mutateAsync({
            toEmail: data.toEmail,
            subject: data.subject,
            body: data.body,
            attachments
        });
    };

    return {
        markAsRead,
        markAsUnread,
        deleteMessage,
        restoreMessage,
        sendReply,
        sendMessage,
        isLoading: 
            replyMutation.isPending || 
            deleteMutation.isPending || 
            permanentlyDeleteMutation.isPending || 
            restoreMutation.isPending || 
            createMessageMutation.isPending ||
            markAsReadMutation.isPending ||
            markAsUnreadMutation.isPending
    };
}
