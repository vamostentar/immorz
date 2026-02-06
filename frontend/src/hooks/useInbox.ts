import { useMessages, useMessageStats } from '@/api/queries';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types';
import { useState } from 'react';

interface UseInboxProps {
    mode: 'admin' | 'agent';
}

export function useInbox({ mode }: UseInboxProps) {
    const { user } = useAuth();
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isComposing, setIsComposing] = useState(false);
    
    // Filtering state
    const [activeTab, setActiveTab] = useState<'all' | 'received' | 'sent' | 'trash'>('all');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        search: '',
    });

    const agentIdFilter = mode === 'agent' ? user?.id : undefined;

    const queryParams = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        agentId: agentIdFilter,
        ...(activeTab === 'received' && { type: 'INBOUND' as const }),
        ...(activeTab === 'sent' && { type: 'OUTBOUND' as const }),
        ...(activeTab === 'trash' && { deleted: true }),
    };

    const { data: messagesData, isLoading, refetch } = useMessages(queryParams);
    const { data: stats } = useMessageStats(agentIdFilter);

    const handleSelectMessage = (message: Message | null) => {
        setSelectedMessage(message);
    };

    return {
        // State
        selectedMessage,
        isComposing,
        activeTab,
        filters,
        messagesData,
        stats,
        isLoading,
        
        // Actions
        setSelectedMessage: handleSelectMessage,
        setIsComposing,
        setActiveTab,
        setFilters,
        refetch
    };
}
