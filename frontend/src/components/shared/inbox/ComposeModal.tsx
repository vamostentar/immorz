import { Loader2, Paperclip, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { AttachmentList } from './AttachmentList';

interface ComposeModalProps {
    onClose: () => void;
    onSend: (data: { toEmail: string; subject: string; body: string; files: File[] }) => Promise<void>;
    isSending: boolean;
}

// 10MB limit
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// 25MB total limit
const MAX_TOTAL_SIZE_MB = 25;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

export function ComposeModal({ onClose, onSend, isSending }: ComposeModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const totalSize = files.reduce((acc, curr) => acc + curr.file.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            const validFiles: File[] = [];
            const invalidFiles: string[] = [];

            selectedFiles.forEach(f => {
                if (f.size > MAX_FILE_SIZE_BYTES) {
                    invalidFiles.push(f.name);
                } else {
                    validFiles.push(f);
                }
            });

            if (invalidFiles.length > 0) {
                alert(`Os seguintes ficheiros excedem o limite de ${MAX_FILE_SIZE_MB}MB:\n${invalidFiles.join('\n')}`);
            }

            if (validFiles.length > 0) {
                // Check if adding these files exceeds total limit
                const newFilesTotalSize = validFiles.reduce((acc, f) => acc + f.size, 0);
                
                if (totalSize + newFilesTotalSize > MAX_TOTAL_SIZE_BYTES) {
                    alert(`Não é possível adicionar os ficheiros.\nO tamanho total excederia o limite de ${MAX_TOTAL_SIZE_MB}MB.\nEspaço disponível: ${Math.max(0, (MAX_TOTAL_SIZE_BYTES - totalSize) / (1024 * 1024)).toFixed(1)}MB`);
                } else {
                    const newFiles = validFiles.map(f => ({
                        id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        file: f
                    }));
                    setFiles(prev => [...prev, ...newFiles]);
                }
            }
        }
        
        // Sempre limpar o value para permitir selecionar o mesmo ficheiro novamente se for removido
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (id: string | number) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSubmit = async () => {
        if (!recipientEmail || !subject || !body.trim()) {
            alert('Por favor preencha todos os campos obrigatórios.');
            return;
        }

        setIsUploading(true);
        try {
            const fileList = files.map(f => f.file);
            await onSend({ toEmail: recipientEmail, subject, body, files: fileList });
        } catch (error) {
            // Error handling in parent
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                {/* Header Refinado */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Send className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Nova Mensagem</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="space-y-6">
                        {/* Email-like fields */}
                        <div className="relative group">
                            <label className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">Para</label>
                            <input
                                type="email"
                                placeholder="exemplo@email.com"
                                className="w-full py-2 border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder-gray-400 font-medium"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                            />
                        </div>
                        
                        <div className="relative group">
                            <label className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">Assunto</label>
                            <input
                                type="text"
                                placeholder="Sobre o que é esta mensagem?"
                                className="w-full py-2 border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder-gray-400 font-medium"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-blue-600 uppercase tracking-wider">Corpo da Mensagem</label>
                                <span className={`text-[10px] font-bold ${body.length > 1000 ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {body.length} caracteres
                                </span>
                            </div>
                            <textarea
                                placeholder="Escreva aqui a sua mensagem detalhada..."
                                className="w-full h-48 px-4 py-3 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400 resize-none font-medium leading-relaxed"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Attachments Section */}
                        {files.length > 0 && (
                            <div className="pt-2">
                                <div className="flex justify-between items-end mb-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ficheiros Anexados ({files.length})</p>
                                    <span className={`text-[10px] font-medium ${totalSize > MAX_TOTAL_SIZE_BYTES * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                                        Total: {totalSizeMB}MB / {MAX_TOTAL_SIZE_MB}MB
                                    </span>
                                </div>
                                <AttachmentList files={files} onRemove={handleRemoveFile} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all font-semibold text-sm"
                    >
                        <Paperclip className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <div className="flex flex-col items-start text-xs">
                            <span>Anexar Ficheiro</span>
                            <span className="text-[10px] font-normal opacity-70">(Máx: {MAX_FILE_SIZE_MB}MB)</span>
                        </div>
                    </button>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        multiple 
                    />

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-bold text-sm tracking-wide transition-colors"
                        >
                            CANCELAR
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSending || isUploading}
                            className="btn btn-primary px-8 py-2.5 text-sm uppercase tracking-widest"
                        >
                            {isSending || isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isUploading ? 'A Carregar...' : 'A Enviar...'}
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Enviar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
