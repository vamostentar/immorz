import { Message, MessageStatus } from '@/types';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CheckCircle, Clock, Mail, Plus, RefreshCw, Search, XCircle } from 'lucide-react';

interface InboxSidebarProps {
    stats: { unread: number; total: number } | undefined;
    filters: { search: string };
    setFilters: (filters: any) => void;
    refetch: () => void;
    activeTab: 'all' | 'received' | 'sent' | 'trash';
    setActiveTab: (tab: 'all' | 'received' | 'sent' | 'trash') => void;
    messagesData: { data: Message[] } | undefined;
    isLoading: boolean;
    selectedMessage: Message | null;
    onSelectMessage: (message: Message) => void;
    onCompose: () => void;
}

export function InboxSidebar({
    stats,
    filters,
    setFilters,
    refetch,
    activeTab,
    setActiveTab,
    messagesData,
    isLoading,
    selectedMessage,
    onSelectMessage,
    onCompose
}: InboxSidebarProps) {
    
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
        <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
            {/* Header / Stats */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Caixa de Entrada
                    {stats && (
                        <div className="flex gap-1 ml-1">
                            <span className="text-[10px] font-medium bg-blue-600 text-white px-1.5 py-0.5 rounded-full" title="Não lidas">
                                {stats.unread || 0}
                            </span>
                            <span className="text-[10px] font-normal bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full" title="Total">
                                {stats.total}
                            </span>
                        </div>
                    )}
                </h2>
                <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={filters.search}
                            onChange={(e) => setFilters((prev: any) => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                    <button
                        onClick={onCompose}
                        className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1 shadow-sm"
                        title="Nova Mensagem"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs font-medium hidden sm:inline">Nova</span>
                    </button>
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
                                onClick={() => onSelectMessage(msg)}
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
    );
}
