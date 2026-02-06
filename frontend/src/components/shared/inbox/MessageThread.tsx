import { useMessageConversation } from '@/api/queries';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface MessageThreadProps {
    messageId: string;
    originalBody: string;
}

export function MessageThread({ messageId, originalBody }: MessageThreadProps) {
    const { data: conversationMessages } = useMessageConversation(messageId);

    if (conversationMessages && conversationMessages.length > 1) {
        return (
            <div className="space-y-6">
                {conversationMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`p-4 rounded-lg ${
                            msg.type === 'OUTBOUND'
                                ? 'bg-blue-50 border-l-4 border-blue-500 ml-8'
                                : 'bg-gray-50 border-l-4 border-gray-300'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    msg.type === 'OUTBOUND'
                                        ? 'bg-blue-200 text-blue-700'
                                        : 'bg-gray-200 text-gray-700'
                                }`}>
                                    {msg.type === 'OUTBOUND' ? 'R' : msg.fromName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 text-sm">
                                        {msg.type === 'OUTBOUND' ? 'Ribeira Azul' : msg.fromName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(msg.createdAt), 'PPP p', { locale: pt })}
                                    </div>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                msg.type === 'OUTBOUND'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {msg.type === 'OUTBOUND' ? 'Enviada' : 'Recebida'}
                            </span>
                        </div>
                        <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                            {msg.body}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
            {originalBody}
        </div>
    );
}
