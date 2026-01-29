import { useDeleteMessage, useMarkMessageAsRead, useMarkMessageAsUnread, useMessages, useMessageStats, useReplyToMessage } from '@/api/queries';
import { useAuth } from '@/context/AuthContext';
import { Message, MessageStatus } from '@/types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    EyeOff,
    Loader2,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Search,
    Send,
    Trash2,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

interface SharedInboxProps {
    mode: 'admin' | 'agent';
}

export default function SharedInbox({ mode }: SharedInboxProps) {
    const { user } = useAuth();
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'received' | 'sent' | 'trash'>('all');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        search: '',
    });

    // Calculate agentId filter: if mode is agent, use current user ID
    const agentIdFilter = mode === 'agent' ? user?.id : undefined;

    // Build query params based on active tab
    const queryParams = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        agentId: agentIdFilter,
        // Tab-specific filters
        ...(activeTab === 'received' && { type: 'INBOUND' as const }),
        ...(activeTab === 'sent' && { type: 'OUTBOUND' as const }),
        ...(activeTab === 'trash' && { deleted: true }),
    };

    const { data: messagesData, isLoading, refetch } = useMessages(queryParams);


    const { data: stats } = useMessageStats(agentIdFilter);

    // Mutations
    const replyMutation = useReplyToMessage();
    const markAsReadMutation = useMarkMessageAsRead();
    const markAsUnreadMutation = useMarkMessageAsUnread();
    const deleteMutation = useDeleteMessage();

    const handleSelectMessage = async (message: Message) => {
        setSelectedMessage(message);
        setReplyText('');

        // Mark as read when selecting
        if (!message.read) {
            try {
                await markAsReadMutation.mutateAsync(message.id);
            } catch (error) {
                console.error('Failed to mark message as read:', error);
            }
        }
    };

    const handleSendReply = async () => {
        if (!selectedMessage || !replyText.trim()) return;

        try {
            await replyMutation.mutateAsync({
                messageId: selectedMessage.id,
                body: replyText,
            });

            setReplyText('');
            alert('Resposta enviada com sucesso!');
        } catch (error) {
            console.error('Failed to send reply:', error);
            alert('Erro ao enviar resposta. Tente novamente.');
        }
    };

    const handleMarkAsUnread = async () => {
        if (!selectedMessage) return;
        try {
            await markAsUnreadMutation.mutateAsync(selectedMessage.id);
            setSelectedMessage(null);
        } catch (error) {
            console.error('Failed to mark message as unread:', error);
        }
    };

    const handleDeleteMessage = async () => {
        if (!selectedMessage) return;
        try {
            await deleteMutation.mutateAsync(selectedMessage.id);
            setSelectedMessage(null);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Failed to delete message:', error);
            alert('Erro ao eliminar mensagem. Tente novamente.');
        }
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

    const getStatusIcon = (status: MessageStatus) => {
        switch (status) {
            case 'RECEIVED': return <Mail className="w-4 h-4" />;
            case 'QUEUED': return <Clock className="w-4 h-4" />;
            case 'SENT': return <CheckCircle className="w-4 h-4" />;
            case 'FAILED': return <XCircle className="w-4 h-4" />;
            default: return <Mail className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            {/* Left Sidebar - Message List */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                {/* Header / Stats */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Inbox
                        {stats && (
                            <span className="text-xs font-normal bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                {stats.total}
                            </span>
                        )}
                    </h2>
                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar em mensagens..."
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            />
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Atualizar"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-3 py-1 rounded-full whitespace-nowrap ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`px-3 py-1 rounded-full whitespace-nowrap ${activeTab === 'received' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Recebidas
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`px-3 py-1 rounded-full whitespace-nowrap ${activeTab === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Enviadas
                        </button>
                        <button
                            onClick={() => setActiveTab('trash')}
                            className={`px-3 py-1 rounded-full whitespace-nowrap ${activeTab === 'trash' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Lixo
                        </button>
                    </div>

                </div>


                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse flex gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : messagesData?.data && messagesData.data.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {messagesData.data.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => handleSelectMessage(msg)}
                                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3 items-start ${selectedMessage?.id === msg.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                                >
                                    <div className={`p-2 rounded-full flex-shrink-0 ${msg.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                                        {getStatusIcon(msg.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-sm font-medium truncate ${msg.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                                {msg.type === 'OUTBOUND'
                                                    ? `Para: ${msg.context?.replyTo || 'Destinatário desconhecido'}`
                                                    : (msg.fromName || msg.fromEmail)}
                                            </span>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {format(new Date(msg.createdAt), 'dd MMM', { locale: pt })}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate mb-1 ${msg.read ? 'text-gray-500' : 'text-gray-800'}`}>
                                            {/* Assuming context or subject, otherwise body preview */}
                                            {msg.context?.reason || "Mensagem de Contacto"}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {msg.body}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                            <Mail className="w-12 h-12 mb-2 opacity-20" />
                            <p>Nenhuma mensagem encontrada</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Painel Direito - Detalhes da Mensagem */}
            <div className={`flex-1 flex flex-col bg-white min-w-0 ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                {!selectedMessage ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Mail className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-lg">Selecione uma mensagem para ler</p>
                    </div>
                ) : (
                    <>
                        {/* Barra de Ferramentas */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10 w-full">
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="md:hidden text-gray-500 hover:text-gray-700"
                            >
                                ← Voltar
                            </button>
                            <div className="flex gap-2 ml-auto">
                                {selectedMessage.read ? (
                                    <button
                                        onClick={handleMarkAsUnread}
                                        disabled={markAsUnreadMutation.isPending}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                                        title="Marcar como não lido"
                                    >
                                        {markAsUnreadMutation.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <EyeOff className="w-5 h-5" />
                                        )}
                                    </button>
                                ) : (
                                    <span className="p-2 text-green-500" title="Não lido">
                                        <Eye className="w-5 h-5" />
                                    </span>
                                )}
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Delete Confirmation Modal */}
                        {showDeleteConfirm && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Mensagem</h3>
                                    <p className="text-gray-600 mb-4">Tem a certeza que deseja eliminar esta mensagem? Esta ação não pode ser revertida.</p>
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleDeleteMessage}
                                            disabled={deleteMutation.isPending}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md transition-colors flex items-center gap-2"
                                        >
                                            {deleteMutation.isPending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    A eliminar...
                                                </>
                                            ) : (
                                                'Eliminar'
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
                                        {selectedMessage.context?.reason || "Mensagem de Contacto"}
                                    </h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedMessage.status)}`}>
                                        {selectedMessage.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {selectedMessage.type === 'OUTBOUND'
                                                ? 'R'
                                                : selectedMessage.fromName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {selectedMessage.type === 'OUTBOUND' ? 'Ribeira Azul' : selectedMessage.fromName}
                                            </div>
                                            <div className="text-sm text-blue-600 flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {selectedMessage.type === 'OUTBOUND' ? (
                                                    <span>Para: <a href={`mailto:${selectedMessage.context?.replyTo}`} className="hover:underline">{selectedMessage.context?.replyTo}</a></span>
                                                ) : (
                                                    <a href={`mailto:${selectedMessage.fromEmail}`} className="hover:underline">{selectedMessage.fromEmail}</a>
                                                )}
                                            </div>
                                            {selectedMessage.phone && (
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Phone className="w-3 h-3" />
                                                    <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 text-sm text-gray-500 ml-auto text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(selectedMessage.createdAt), 'PPP p', { locale: pt })}
                                        </div>
                                        {selectedMessage.propertyId && (
                                            <div className="flex items-center gap-1 justify-end text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                <MapPin className="w-3 h-3" />
                                                Ref. ID: {selectedMessage.propertyId.substring(0, 8)}...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {selectedMessage.body}
                                </div>
                            </div>

                            {/* Reply Box */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-8">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Responder</h3>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-3 text-sm h-32"
                                    placeholder="Escreva a sua resposta..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    disabled={replyMutation.isPending}
                                ></textarea>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        A resposta será enviada para {selectedMessage.fromEmail}
                                    </span>
                                    <button
                                        onClick={handleSendReply}
                                        disabled={replyMutation.isPending || !replyText.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        {replyMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                A enviar...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Enviar Resposta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Context Info (if available) */}
                            {selectedMessage.context && Object.keys(selectedMessage.context).length > 0 && (
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Dados Técnicos</h3>
                                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                        <pre className="text-xs text-green-400 font-mono">
                                            {JSON.stringify(selectedMessage.context, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
