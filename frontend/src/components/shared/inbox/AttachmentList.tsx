import { Download, Mail, Paperclip, X } from 'lucide-react';

interface AttachmentFile {
    name: string;
    url?: string;
    type?: string;
    size: number;
}

interface AttachmentListProps {
    files?: (File | { id: string; file: File })[];
    attachments?: AttachmentFile[];
    onRemove?: (idOrIndex: string | number) => void;
    readonly?: boolean;
}

export function AttachmentList({ files = [], attachments = [], onRemove, readonly = false }: AttachmentListProps) {
    // Combine files (being uploaded) and attachments (already uploaded/received)
    const allItems = [
        ...files.map((f, i) => {
            const file = 'file' in f ? f.file : f;
            const id = 'id' in f ? f.id : i;
            return {
                id,
                name: file.name,
                size: file.size,
                isFile: true,
                url: undefined as string | undefined,
                type: file.type
            };
        }),
        ...attachments.map((a, i) => ({ 
            id: a.url || `att-${i}`,
            name: a.name, 
            size: a.size, 
            isFile: false, 
            url: a.url, 
            type: a.type 
        }))
    ];

    if (allItems.length === 0) return null;

    return (
        <div className={`grid grid-cols-1 ${readonly ? 'sm:grid-cols-2' : ''} gap-3`}>
            {allItems.map((item) => (
                <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg group ${readonly ? 'hover:border-blue-300 transition-colors' : ''}`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {readonly ? (
                            <div className="p-2 bg-white rounded border border-gray-200 text-blue-600">
                                <Mail className="w-4 h-4" />
                            </div>
                        ) : (
                            <Paperclip className="w-3 h-3 text-gray-400" />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>
                                {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {item.size ? `${(item.size / 1024).toFixed(1)} KB` : item.type}
                            </p>
                        </div>
                    </div>

                    {readonly && item.url ? (
                        <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            title="Descarregar / Abrir"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    ) : onRemove && (
                        <button 
                            onClick={() => onRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 ml-1 p-2 rounded-full hover:bg-red-50"
                            title="Remover anexo"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
