import type { Approval } from '@/api/notifications';
import { useEntityAuditLogs } from '@/api/notifications/audit-queries';
import {
    Activity,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Home,
    Info,
    Shield,
    User,
    UserCircle,
    X
} from 'lucide-react';
import React from 'react';

interface ApprovalDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    approval: Approval | null;
}

export const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({ 
    isOpen, 
    onClose, 
    approval 
}) => {
    const { data: auditLogs, isLoading: isAuditLoading } = useEntityAuditLogs(
        approval?.entityType || '', 
        approval?.entityId || ''
    );

    if (!isOpen || !approval) return null;

    const metadata = approval.metadata || {};

    const getEntityIcon = () => {
        switch (approval.entityType) {
            case 'AGENT': return <User size={24} className="text-blue-500" />;
            case 'PROPERTY': return <Home size={24} className="text-green-500" />;
            case 'DOCUMENT': return <FileText size={24} className="text-orange-500" />;
            default: return <Info size={24} className="text-gray-500" />;
        }
    };

    const renderMetadataFields = () => {
        return Object.entries(metadata).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key} className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">{key}</span>
                        <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap font-mono">
                            {JSON.stringify(value, null, 2)}
                        </pre>
                    </div>
                );
            }
            return (
                <div key={key} className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{key}</span>
                    <span className="text-sm text-gray-700 font-bold break-words">
                        {String(value)}
                    </span>
                </div>
            );
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col transition-all transform scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center space-x-5">
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                            {getEntityIcon()}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Detalhes do Item</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Protocolo:</span>
                                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{approval.id}</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100 active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Info Column */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* General Info */}
                            <section className="space-y-6">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center">
                                    <Shield size={16} className="mr-3 text-blue-500" />
                                    Informação do Registo
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                                            approval.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            approval.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            approval.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                approval.status === 'PENDING' ? 'bg-orange-500 animate-pulse' :
                                                approval.status === 'APPROVED' ? 'bg-green-500' :
                                                approval.status === 'REJECTED' ? 'bg-red-500' :
                                                'bg-gray-500'
                                            }`} />
                                            {approval.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Entidade</span>
                                        <span className="text-sm text-gray-900 font-bold">{approval.entityType}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">ID Entidade</span>
                                        <span className="text-sm text-gray-900 font-mono font-bold bg-white px-2 py-1 rounded border border-gray-100">{approval.entityId}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Data Criação</span>
                                        <div className="flex items-center text-sm text-gray-900 font-bold">
                                            <Calendar size={14} className="mr-2 text-gray-400" />
                                            {new Date(approval.createdAt).toLocaleString('pt-PT')}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Metadata Section */}
                            <section className="space-y-6">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center">
                                    <FileText size={16} className="mr-3 text-green-500" />
                                    Conteúdo do Pedido
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    {renderMetadataFields()}
                                </div>
                            </section>

                            {/* Review History Notes */}
                            {approval.notes && (
                                <section className="space-y-4">
                                    <h4 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em]">Notas de Revisão</h4>
                                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <CheckCircle2 size={48} className="text-blue-900" />
                                        </div>
                                        <p className="text-blue-900 text-sm italic relative z-10 leading-relaxed font-medium">
                                            &quot;{approval.notes}&quot;
                                        </p>
                                        <div className="mt-4 flex items-center text-xs text-blue-700 font-bold">
                                            <User size={12} className="mr-1.5" />
                                            Revisado por Admin em {approval.reviewedAt ? new Date(approval.reviewedAt).toLocaleString('pt-PT') : 'N/A'}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Audit Logs Sidebar */}
                        <div className="space-y-8">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center">
                                <Activity size={16} className="mr-3 text-orange-500" />
                                Logs de Auditoria
                            </h4>
                            
                            {isAuditLoading ? (
                                <div className="flex flex-col items-center justify-center p-10 space-y-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                    <span className="text-xs font-bold text-gray-400 uppercase">Consultando trilha...</span>
                                </div>
                            ) : auditLogs && auditLogs.length > 0 ? (
                                <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gray-100 before:ml-[0.1rem]">
                                    {auditLogs.map((log) => (
                                        <div key={log.id} className="relative pl-10">
                                            <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 ${
                                                log.action.includes('APPROVE') ? 'bg-green-500' :
                                                log.action.includes('REJECT') ? 'bg-red-500' :
                                                'bg-blue-500'
                                            }`}>
                                                <Clock size={12} className="text-white" />
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <p className="text-xs font-black text-gray-900 mb-1">{log.action}</p>
                                                <div className="flex items-center text-[10px] text-gray-400 font-bold space-x-2">
                                                    <span className="flex items-center">
                                                        <UserCircle size={10} className="mr-1" />
                                                        {log.userId.substring(0, 8)}...
                                                    </span>
                                                    <span>•</span>
                                                    <span>{new Date(log.createdAt).toLocaleString('pt-PT')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-xs font-bold text-gray-400">Sem logs registados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-10 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 uppercase"
                    >
                        Fechar Visualização
                    </button>
                </div>
            </div>
        </div>
    );
};

const Loader2 = ({ className, ...props }: any) => (
    <Activity className={`animate-spin ${className}`} {...props} />
);
