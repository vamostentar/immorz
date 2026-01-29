import {
    useCreateProperty,
    useDeleteProperty,
    useProperties,
    useUpdateProperty,
    useUpdatePropertyAdminStatus
} from '@/api/queries';
import { uploadPropertyImagesImproved } from '@/api/upload-utils';
import { AdminStatusBadge } from '@/components/Badges';
import PropertyForm, { PropertyFormRef } from '@/components/forms/PropertyForm';
import Modal from '@/components/Modal';
import { ListSkeleton } from '@/components/Skeleton';
import { StatusDropdown } from '@/components/StatusDropdown';
import { Toast } from '@/components/Toast';
import { useAuth } from '@/context/AuthContext';
import {
    Eye,
    Filter,
    Pencil,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface PropertiesManagerProps {
    mode: 'admin' | 'agent';
}

interface PropertyRowProps {
    property: any;
    onEdit: (property: any) => void;
    onDelete: (property: any) => void;
    onQuickStatusChange: (property: any, status: 'ACTIVE' | 'PENDING' | 'INACTIVE') => void;
    isPending: boolean;
    mode: 'admin' | 'agent';
}

const PropertyRow: React.FC<PropertyRowProps> = ({
    property,
    onEdit,
    onDelete,
    onQuickStatusChange,
    isPending,
    mode
}) => {
    // Verificar se a propriedade tem ID válido
    const hasValidId = property?.id && typeof property.id === 'string' && property.id.length > 0;

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-4">
                <div className="font-medium text-gray-800">{property.title}</div>
                <div className="text-sm text-gray-500">{property.type || 'Venda'}</div>
            </td>
            <td className="p-4 font-semibold text-green-600">€{Number(property.price ?? 0).toLocaleString('pt-PT')}</td>
            <td className="p-4">
                {mode === 'admin' ? (
                    <div className="flex items-center gap-3">
                        <AdminStatusBadge status={property.adminStatus || 'ACTIVE'} />
                        <StatusDropdown
                            value={property.adminStatus || 'ACTIVE'}
                            onChange={(value) => onQuickStatusChange(property, value)}
                            className="min-w-[100px]"
                        />
                    </div>
                ) : (
                    <AdminStatusBadge status={property.adminStatus || 'ACTIVE'} />
                )}
            </td>
            <td className="p-4 text-gray-600">{property.views || 0} visualizações</td>
            <td className="p-4">
                <div className="flex space-x-2">
                    {/* O link de detalhes depende do contexto? Por agora usa a rota de admin, mas devia ser adaptada se houver rota de detalhes de agente */}
                    {/* Assumindo que o agente pode ver a página de detalhes existente ou uma nova */}
                    <Link
                        to={mode === 'admin' ? `/admin/properties/${property.id}/images` : `/agent/properties/${property.id}`}
                        className={`p-2 rounded-lg transition-colors ${hasValidId
                            ? 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed opacity-50'
                            }`}
                        onClick={(e) => {
                            if (!hasValidId) {
                                e.preventDefault();
                                console.warn('⚠️ Propriedade sem ID válido:', property);
                                return;
                            }
                        }}
                        title={hasValidId ? 'Ver detalhes' : 'ID da propriedade inválido'}
                    >
                        <Eye size={16} />
                    </Link>
                    <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        onClick={() => onEdit(property)}
                        title="Editar propriedade"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        disabled={isPending}
                        onClick={() => onDelete(property)}
                        title="Eliminar propriedade"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default function PropertiesManager({ mode }: PropertiesManagerProps) {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [cursor, setCursor] = useState<string | undefined>(undefined);

    // Configurar filtros baseados no modo
    const queryFilters = useMemo(() => ({
        q: searchTerm || undefined,
        cursor: cursor || undefined,
        limit: 10,
        // Se for agente, filtrar pelo ID do agente
        agentId: mode === 'agent' ? user?.id : undefined
    }), [searchTerm, cursor, mode, user?.id]);

    const { data: propertiesData, isLoading, error, refetch } = useProperties(queryFilters);

    const deleteProperty = useDeleteProperty();
    const createProperty = useCreateProperty();
    const updateProperty = useUpdateProperty();
    const updateStatus = useUpdatePropertyAdminStatus();

    const rows = useMemo(() => propertiesData?.data ?? [], [propertiesData]);
    const pagination = propertiesData?.pagination;

    const [toast, setToast] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [edit, setEdit] = useState<{ open: boolean; property?: any }>({ open: false });

    // Refs para os formulários
    const createFormRef = useRef<PropertyFormRef>(null);
    const editFormRef = useRef<PropertyFormRef>(null);

    const handleDelete = async (property: any) => {
        if (!confirm('Eliminar esta propriedade?')) return;
        try {
            await deleteProperty.mutateAsync(property.id);
            setToast('Propriedade eliminada com sucesso');
        } catch (error) {
            setToast('Erro ao eliminar propriedade');
        }
    };

    const handleQuickStatusChange = async (property: any, newStatus: 'ACTIVE' | 'PENDING' | 'INACTIVE') => {
        // Agentes não devem poder mudar status diretamente via quick dropdown
        if (mode === 'agent') return;

        try {
            await updateStatus.mutateAsync({
                propertyId: property.id,
                adminStatus: newStatus
            });
            setToast(`Estado alterado para ${newStatus === 'ACTIVE' ? 'Ativo' : newStatus === 'PENDING' ? 'Pendente' : 'Inativo'}`);
        } catch (error) {
            setToast('Erro ao alterar estado da propriedade');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    {mode === 'admin' ? 'Gestão de Propriedades' : 'Os Meus Imóveis'}
                </h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    onClick={() => setCreateOpen(true)}
                >
                    <Plus size={20} />
                    <span>Nova Propriedade</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Procurar propriedades..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                            <Filter size={20} />
                            <span>Filtros</span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-6">
                        <ListSkeleton rows={5} />
                    </div>
                ) : error ? (
                    <div className="p-6">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-left">
                            <p className="text-red-700 text-sm font-semibold mb-1">Falha ao carregar propriedades</p>
                            <p className="text-red-700 text-sm">Verifica a configuração da API.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {rows.length === 0 ? (
                            <div className="p-6 text-center text-gray-600">
                                Nenhuma propriedade encontrada. Clique em &quot;Nova Propriedade&quot; para criar.
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-gray-700">Propriedade</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Preço</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Visualizações</th>
                                        <th className="text-left p-4 font-semibold text-gray-700">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((property: any) => (
                                        <PropertyRow
                                            key={property.id}
                                            property={property}
                                            onEdit={(p) => setEdit({ open: true, property: p })}
                                            onDelete={() => handleDelete(property)}
                                            onQuickStatusChange={handleQuickStatusChange}
                                            isPending={deleteProperty.isPending}
                                            mode={mode}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {pagination && rows.length > 0 && (
                    <div className="p-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <button
                                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                disabled={!pagination?.nextCursor}
                                onClick={() => setCursor(pagination?.nextCursor || undefined)}
                            >
                                Próxima página
                            </button>
                            <span className="text-sm text-gray-600">
                                {rows.length} / {pagination.totalEstimate ?? '—'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <Modal open={createOpen} title="Nova Propriedade" onClose={() => setCreateOpen(false)}>
                <PropertyForm
                    ref={createFormRef}
                    submitting={createProperty.isPending}
                    onSubmit={async (values, images) => {
                        try {
                            // 1. Criar propriedade
                            // Se for agente, o backend deve tratar da atribuição do agentId (ou mandamos aqui se o endpoint permitir)
                            const property = await createProperty.mutateAsync(values);
                            const propertyId = property?.data?.id || property?.id;

                            if (!propertyId) throw new Error('Falha ao obter ID da propriedade criada');

                            // 2. Upload imagens
                            if (images && images.length > 0) {
                                const imageFiles = images.map(img => img.file);
                                if (createFormRef.current?.startUpload) createFormRef.current.startUpload();

                                await uploadPropertyImagesImproved(propertyId, imageFiles, {
                                    onImageProgress: (idx, prog) => {
                                        const status = prog === 100 ? 'success' : 'uploading';
                                        createFormRef.current?.updateImageProgress(idx, prog, status);
                                    }
                                });

                                if (createFormRef.current) createFormRef.current.updateAllImagesStatus('success');
                            }

                            // Sucesso
                            await new Promise(r => setTimeout(r, 500));
                            if (createFormRef.current) createFormRef.current.clearImages();
                            setCreateOpen(false);
                            setToast('Propriedade criada com sucesso');
                            refetch();
                        } catch (error) {
                            console.error('Erro ao criar:', error);
                            setToast('Erro ao criar propriedade');
                            if (createFormRef.current) createFormRef.current.updateAllImagesStatus('error');
                        }
                    }}
                />
            </Modal>

            <Modal open={edit.open} title="Editar Propriedade" onClose={() => setEdit({ open: false })}>
                {edit.property && (
                    <PropertyForm
                        ref={editFormRef}
                        initial={edit.property}
                        submitting={updateProperty.isPending}
                        onSubmit={async (values, images) => {
                            try {
                                // 1. Atualizar
                                await updateProperty.mutateAsync({
                                    id: edit.property!.id,
                                    payload: values
                                });

                                // 2. Imagens
                                if (images && images.length > 0) {
                                    const imageFiles = images.map(img => img.file);
                                    if (editFormRef.current?.startUpload) editFormRef.current.startUpload();

                                    await uploadPropertyImagesImproved(edit.property!.id, imageFiles, {
                                        onImageProgress: (idx, prog) => {
                                            const status = prog === 100 ? 'success' : 'uploading';
                                            editFormRef.current?.updateImageProgress(idx, prog, status);
                                        }
                                    });
                                    if (editFormRef.current) editFormRef.current.updateAllImagesStatus('success');
                                }

                                await new Promise(r => setTimeout(r, 500));
                                if (editFormRef.current) editFormRef.current.clearImages();
                                setEdit({ open: false });
                                setToast('Propriedade atualizada');
                                refetch();
                            } catch (error) {
                                setToast('Erro ao atualizar propriedade');
                            }
                        }}
                    />
                )}
            </Modal>

            <Toast text={toast ?? ''} show={!!toast} onClose={() => setToast(null)} />
        </div>
    );
}
