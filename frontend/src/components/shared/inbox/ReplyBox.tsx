import { Loader2, Paperclip, Send } from 'lucide-react';
import { AttachmentList } from './AttachmentList';

interface ReplyBoxProps {
    replyText: string;
    setReplyText: (text: string) => void;
    onSend: () => void;
    isPending: boolean;
    isUploading: boolean;
    files: (File | { id: string; file: File })[];
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (idOrIndex: string | number) => void;
}

export function ReplyBox({
    replyText,
    setReplyText,
    onSend,
    isPending,
    isUploading,
    files,
    onFileSelect,
    onRemoveFile
}: ReplyBoxProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-8">
            <div className="mb-3">
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-3 text-sm h-32"
                    placeholder="Escreva a sua resposta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isPending}
                ></textarea>
                
                {files.length > 0 && (
                     <div className="mb-3">
                        <AttachmentList files={files} onRemove={onRemoveFile} />
                     </div>
                )}
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <label className="cursor-pointer p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Anexar ficheiro">
                        <Paperclip className="w-5 h-5" />
                        <input 
                            type="file" 
                            onChange={onFileSelect} 
                            className="hidden" 
                            multiple 
                        />
                    </label>
                    <span className="text-xs text-gray-400 lg:inline hidden">
                        Clique em enviar para responder via email.
                    </span>
                </div>
                <button
                    onClick={onSend}
                    disabled={isPending || isUploading || !replyText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    {isPending || isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isUploading ? 'A carregar anexos...' : 'A enviar...'}
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
    );
}
