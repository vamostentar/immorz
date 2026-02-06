import {
  useApprovals,
  useApproveApproval,
  useDeleteApproval,
  useRejectApproval,
  type Approval,
  type ApprovalEntity
} from '@/api/notifications';
import AdminLayout from '@/components/admin/AdminLayout';
import { ApprovalDetailModal } from '@/components/admin/ApprovalDetailModal';
import { ApprovalModal } from '@/components/admin/ApprovalModal';
import { Toast } from '@/components/Toast';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  History as HistoryIcon,
  Info,
  Loader2,
  Trash2,
  XCircle
} from 'lucide-react';
import React, { useState } from 'react';

// Map backend ApprovalEntity to frontend display type
type DisplayType = 'property' | 'user' | 'report';

interface PendingItem {
  id: string;
  type: DisplayType;
  entityType: ApprovalEntity;
  entityId: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high';
}

// Helper: Map backend entity type to display type
function mapEntityTypeToDisplayType(entityType: ApprovalEntity): DisplayType {
  switch (entityType) {
    case 'AGENT':
      return 'user';
    case 'PROPERTY':
      return 'property';
    case 'DOCUMENT':
      return 'report';
    default:
      return 'property';
  }
}

// Helper: Transform API Approval to PendingItem for UI
function transformApprovalToPendingItem(approval: Approval): PendingItem {
  const displayType = mapEntityTypeToDisplayType(approval.entityType);
  
  // Generate user-friendly title based on entity type
  let title = '';
  let description = '';
  
  switch (approval.entityType) {
    case 'AGENT':
      title = `Novo Agente: ${approval.metadata?.name || 'Nome não disponível'}`;
      description = 'Pedido de registo como agente imobiliário';
      break;
    case 'PROPERTY':
      title = approval.metadata?.title || `Propriedade ID: ${approval.entityId}`;
      description = approval.metadata?.description || 'Propriedade aguardando aprovação';
      break;
    case 'DOCUMENT':
      title = approval.metadata?.title || 'Documento';
      description = approval.metadata?.description || 'Documento aguardando revisão';
      break;
  }

  return {
    id: approval.id,
    type: displayType,
    entityType: approval.entityType,
    entityId: approval.entityId,
    title,
    description,
    submittedBy: approval.metadata?.submittedBy || approval.requestedBy || 'Utilizador',
    submittedAt: new Date(approval.createdAt).toLocaleString('pt-PT'),
    priority: approval.metadata?.priority || 'medium',
  };
}

interface ApprovalRowProps {
  item: PendingItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
  isHistory?: boolean;
}

const ApprovalRow: React.FC<ApprovalRowProps> = ({ item, onApprove, onReject, onView, onDelete, isHistory }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'property': return 'bg-blue-100 text-blue-700';
      case 'user': return 'bg-green-100 text-green-700';
      case 'report': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'property': return 'Propriedade';
      case 'user': return 'Utilizador';
      case 'report': return 'Relatório';
      default: return 'Outro';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <Clock size={16} className="text-gray-400" />
          <div>
            <div className="font-medium text-gray-800">{item.title}</div>
            <div className="text-sm text-gray-500">{item.description}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
          {getTypeLabel(item.type)}
        </span>
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
          {getPriorityLabel(item.priority)}
        </span>
      </td>
      <td className="p-4 text-sm text-gray-600">
        <div>{item.submittedBy}</div>
        <div className="text-xs text-gray-500">{item.submittedAt}</div>
      </td>
      <td className="p-4">
        <div className="flex space-x-2">
          {!isHistory && (
            <>
              <button 
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => onView(item.id)}
                title="Visualizar"
              >
                <Eye size={16} />
              </button>
              <button 
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => onApprove(item.id)}
                title="Aprovar"
              >
                <CheckCircle size={16} />
              </button>
              <button 
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => onReject(item.id)}
                title="Rejeitar"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
          {isHistory && (
            <>
              <button 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => onView(item.id)}
                  title="Ver Detalhes"
                >
                  <Eye size={16} />
              </button>
              {onDelete && (
                <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => onDelete(item.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default function Approvals() {
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'property' | 'user' | 'report'>('all');
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [viewingApproval, setViewingApproval] = useState<Approval | null>(null);

  // Fetch real pending approvals from API
  const { data: approvalsData, isLoading, error, refetch } = useApprovals({ 
    status: activeTab === 'pending' ? 'PENDING' : undefined,
    limit: 100 
  });
  const approveMutation = useApproveApproval();
  const rejectMutation = useRejectApproval();
  const deleteMutation = useDeleteApproval();

  // Filter and process data
  const allApprovals = approvalsData?.data || [];
  const pendingApprovals = allApprovals.filter((a: Approval) => a.status === 'PENDING');
  const historyApprovals = allApprovals.filter((a: Approval) => a.status !== 'PENDING');

  const currentItems = activeTab === 'pending' ? pendingApprovals : historyApprovals;

  // Transform API data to UI format
  const displayItems = currentItems.map(transformApprovalToPendingItem);

  const filteredItems = filter === 'all' 
    ? displayItems 
    : displayItems.filter((item: PendingItem) => item.type === filter);

  const handleApproveClick = (id: string) => {
    const item = displayItems.find((i: PendingItem) => i.id === id);
    if (item) {
        setSelectedItem(item);
        setModalType('approve');
    }
  };

  const handleRejectClick = (id: string) => {
    const item = displayItems.find((i: PendingItem) => i.id === id);
    if (item) {
        setSelectedItem(item);
        setModalType('reject');
    }
  };

  const handleConfirm = async (notes: string) => {
    if (!selectedItem || !modalType) return;

    try {
        if (modalType === 'approve') {
            await approveMutation.mutateAsync({ id: selectedItem.id, notes });
            setToast(`✅ ${selectedItem.title} aprovado com sucesso!`);
        } else {
            await rejectMutation.mutateAsync({ id: selectedItem.id, notes });
            setToast(`❌ ${selectedItem.title} rejeitado.`);
        }
        await refetch();
    } catch (err: any) {
        setToast(`❌ Erro: ${err?.response?.data?.message || err.message}`);
        throw err;
    }
  };

  const handleView = (id: string) => {
    const rawApproval = allApprovals.find((a: Approval) => a.id === id);
    if (rawApproval) {
        setViewingApproval(rawApproval);
    }
  };

  const handleDelete = async (id: string) => {
    const item = displayItems.find((i: PendingItem) => i.id === id);
    if (!item) return;

    if (!confirm(`Tem a certeza que deseja eliminar "${item.title}" do histórico?`)) {
        return;
    }

    try {
        await deleteMutation.mutateAsync(id);
        setToast(`🗑️ "${item.title}" eliminado do histórico.`);
        await refetch();
    } catch (err: any) {
        setToast(`❌ Erro ao eliminar: ${err?.response?.data?.message || err.message}`);
    }
  };

  const handleBulkApprove = async (entityType: ApprovalEntity) => {
    const itemsToApprove = pendingApprovals.filter((a: Approval) => a.entityType === entityType);
    if (itemsToApprove.length === 0) {
        setToast(`ℹ️ Não há itens do tipo ${entityType} para aprovar.`);
        return;
    }

    if (!confirm(`Tem a certeza que deseja aprovar ${itemsToApprove.length} itens do tipo ${entityType}?`)) {
        return;
    }

    try {
        setToast(`⏳ A processar ${itemsToApprove.length} aprovações...`);
        let successCount = 0;
        
        for (const item of itemsToApprove) {
            try {
                await approveMutation.mutateAsync({ id: item.id, notes: 'Aprovação em massa via painel admin' });
                successCount++;
            } catch (err) {
                console.error(`Falha ao aprovar item ${item.id}:`, err);
            }
        }
        
        setToast(`✅ ${successCount} itens aprovados com sucesso!`);
        await refetch();
    } catch (err) {
        setToast('❌ Erro durante processamento em massa.');
    }
  };

  const getFilterCount = (type: 'all' | 'property' | 'user' | 'report') => {
    if (type === 'all') return displayItems.length;
    return displayItems.filter((item: PendingItem) => item.type === type).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-6">
            <h2 className="text-2xl font-bold text-gray-800">Pórtico de Aprovações</h2>
            <div className="flex p-1 bg-gray-100 rounded-lg shadow-inner">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                    activeTab === 'pending' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                    Pendentes ({pendingApprovals.length})
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                    activeTab === 'history' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                    <div className="flex items-center">
                        <HistoryIcon size={14} className="mr-1.5" />
                        Histórico
                    </div>
                </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm transition-all hover:bg-gray-50">
            <AlertCircle className={activeTab === 'pending' ? 'text-orange-500' : 'text-blue-500'} size={18} />
            <span className={`text-sm font-bold ${activeTab === 'pending' ? 'text-orange-600' : 'text-blue-600'}`}>
              {activeTab === 'pending' 
                ? `${pendingApprovals.length} itens aguardando aprovação`
                : `${historyApprovals.length} itens processados anteriormente`
              }
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
            {[
              { key: 'all' as const, label: 'Todos' },
              { key: 'property' as const, label: 'Propriedades' },
              { key: 'user' as const, label: 'Utilizadores' },
              { key: 'report' as const, label: 'Relatórios' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 min-w-[120px] px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                  filter === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {label} ({getFilterCount(key)})
              </button>
            ))}
          </div>
        </div>

        {/* Approvals Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center text-gray-600 bg-gray-50/30">
                <Loader2 size={48} className="mx-auto text-blue-500 mb-4 animate-spin" />
                <div className="text-lg font-bold mb-2">Carregando aprovações...</div>
                <div className="text-sm text-gray-400">Pode demorar alguns segundos dependendo da conexão.</div>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-600 bg-red-50/30">
                <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                <div className="text-lg font-bold mb-2">Erro ao carregar aprovações</div>
                <div className="text-sm text-gray-500">{(error as any)?.message || 'Ocorreu um erro ao comunicar com o servidor.'}</div>
                <button 
                  onClick={() => refetch()} 
                  className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-16 text-center text-gray-600 bg-gray-50/30">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-gray-300" />
                </div>
                <div className="text-xl font-bold text-gray-800 mb-2">
                    {activeTab === 'pending' ? 'Nenhuma aprovação pendente' : 'Histórico de aprovações vazio'}
                </div>
                <div className="text-sm text-gray-400">
                    {activeTab === 'pending' 
                        ? 'Ótimo trabalho! Todos os itens foram processados com sucesso.' 
                        : 'Ainda não existem registos de aprovações ou rejeições.'
                    }
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left p-4 font-bold text-xs uppercase tracking-widest text-gray-400">Item</th>
                    <th className="text-left p-4 font-bold text-xs uppercase tracking-widest text-gray-400">Tipo</th>
                    <th className="text-left p-4 font-bold text-xs uppercase tracking-widest text-gray-400">Prioridade</th>
                    <th className="text-left p-4 font-bold text-xs uppercase tracking-widest text-gray-400">Submetido</th>
                    <th className="text-left p-4 font-bold text-xs uppercase tracking-widest text-gray-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredItems.map(item => (
                    <ApprovalRow
                      key={item.id}
                      item={item}
                      onApprove={handleApproveClick}
                      onReject={handleRejectClick}
                      onView={handleView}
                      onDelete={handleDelete}
                      isHistory={activeTab === 'history'}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {activeTab === 'pending' && pendingApprovals.length > 0 && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-100/50 bg-gradient-to-br from-white to-orange-50/30">
            <div className="flex items-center mb-6">
                <div className="p-2 bg-orange-100 rounded-lg mr-4">
                    <AlertCircle size={20} className="text-orange-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Ações Rápidas de Gestão</h3>
                    <p className="text-sm text-gray-500">Poupe tempo processando múltiplas aprovações de uma só vez.</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleBulkApprove('PROPERTY')}
                disabled={approveMutation.isPending}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-100 disabled:opacity-50 active:scale-95"
              >
                Aprovar Todas as Propriedades
              </button>
              <button 
                onClick={() => handleBulkApprove('AGENT')}
                disabled={approveMutation.isPending}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95"
              >
                Aprovar Todos os Utilizadores
              </button>
              <button 
                onClick={() => handleBulkApprove('DOCUMENT')}
                disabled={approveMutation.isPending}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-bold shadow-lg shadow-gray-200 disabled:opacity-50 active:scale-95"
              >
                Validar Todos os Documentos
              </button>
            </div>
            <div className="mt-6 flex items-center text-xs text-gray-400 italic">
                <Info size={12} className="mr-1" />
                * Estas ações aplicam uma aprovação automática com nota padrão a todos os itens visíveis.
            </div>
          </div>
        )}
      </div>

      <ApprovalDetailModal 
        isOpen={!!viewingApproval}
        onClose={() => setViewingApproval(null)}
        approval={viewingApproval}
      />

      <ApprovalModal
        isOpen={!!modalType}
        onClose={() => {
            setModalType(null);
            setSelectedItem(null);
        }}
        onConfirm={handleConfirm}
        type={modalType || 'approve'}
        title={selectedItem?.title || ''}
        description={selectedItem?.description}
      />

      <Toast text={toast ?? ''} show={!!toast} onClose={() => setToast(null)} />
    </AdminLayout>
  );
}
