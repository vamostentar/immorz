import {
    useBulkImportUsers,
    useCreateUser,
    useDeleteUser,
    useResetUserTwoFactor,
    useSendCommunication,
    useUpdateUser,
    useUsers
} from '@/api/admin-queries';
import type { BulkAction, FilterState, User, UserFormData } from '@/types/user-management.types';
import { useCallback, useMemo, useState } from 'react';

/**
 * useUserManagement Hook
 * Centralizes all user management logic and state
 */
export function useUserManagement() {
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

    // User states
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [toast, setToast] = useState<string | null>(null);

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        role: '',
        status: '',
        dateRange: { start: '', end: '' },
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1,
        limit: 20
    });

    // API hooks
    const { data: usersData, isLoading, error, refetch } = useUsers({
        query: filters.search || undefined,
        limit: filters.limit,
        cursor: undefined
    });
    const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
    const { mutateAsync: deleteUser } = useDeleteUser();
    const { mutateAsync: sendCommunication } = useSendCommunication();
    const { mutateAsync: bulkImportUsers } = useBulkImportUsers();
    const { mutateAsync: resetUserTwoFactor } = useResetUserTwoFactor();

    // Derived data
    const users = useMemo(() => usersData?.data || [], [usersData]);
    const totalUsers = usersData?.pagination?.total || users.length;
    const totalPages = usersData?.pagination?.totalPages || 1;

    // Statistics calculation
    const stats = useMemo(() => {
        const getRoleName = (u: User) => {
            if (!u.role) return '';
            return typeof u.role === 'string' ? u.role : u.role.name || '';
        };

        return {
            total: totalUsers,
            active: users.filter((u: User) => u.isActive).length,
            inactive: users.filter((u: User) => !u.isActive).length,
            verified: users.filter((u: User) => u.isVerified || (u as any).isEmailVerified).length,
            unverified: users.filter((u: User) => !u.isVerified && !(u as any).isEmailVerified).length,
            agents: users.filter((u: User) => getRoleName(u).toUpperCase() === 'AGENT').length,
            clients: users.filter((u: User) => {
                const role = getRoleName(u).toUpperCase();
                return role === 'CLIENT' || role === '';
            }).length,
            admins: users.filter((u: User) => {
                const role = getRoleName(u).toUpperCase();
                return role === 'ADMIN' || role === 'MODERATOR' || role === 'SUPER_ADMIN';
            }).length,
        };
    }, [users, totalUsers]);

    // Filter handlers
    const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            role: '',
            status: '',
            dateRange: { start: '', end: '' },
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 20
        });
    }, []);

    // Selection handlers
    const handleSelectUser = useCallback((userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelectedUsers(prev =>
            prev.length === users.length
                ? []
                : users.map((u: User) => u.id)
        );
    }, [users]);

    // User action handlers
    const handleEdit = useCallback((user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    }, []);

    const handleViewDetails = useCallback((user: User) => {
        setEditingUser(user);
        setIsDetailModalOpen(true);
    }, []);

    const handleSaveUser = useCallback(async (formData: UserFormData) => {
        try {
            if (editingUser && editingUser.id) {
                const updateData: any = {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    role: formData.roleId,
                    isActive: formData.isActive,
                    isEmailVerified: formData.isVerified,
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await updateUser({ id: editingUser.id, userData: updateData });
                setToast('Utilizador atualizado com sucesso');
            } else {
                if (!formData.password) {
                    setToast('Palavra-passe é obrigatória para novos utilizadores');
                    return;
                }
                const userData = {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    role: formData.roleId,
                    isActive: formData.isActive,
                    isEmailVerified: formData.isVerified,
                };
                await createUser(userData);
                setToast('Utilizador criado com sucesso');
            }

            setIsEditModalOpen(false);
            setIsCreateModalOpen(false);
            setEditingUser(null);
        } catch (error: any) {
            console.error('Error in handleSaveUser:', error);
            console.log('Error data:', error.response?.data);

            // Tentar extrair mensagem do backend
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error?.message ||
                error.response?.data?.error ||
                error.message ||
                'Erro ao salvar utilizador';

            // Tratamento especial para erro de validação (como o do Super Admin)
            if (errorMessage && errorMessage.includes('Não é possível alterar o role')) {
                setToast(`⚠️ ${errorMessage}`);
                // Fechar modais para dar destaque ao alerta e indicar cancelamento da acção
                setIsEditModalOpen(false);
                setEditingUser(null);
            } else {
                setToast(`Erro: ${errorMessage}`);
            }
        }
    }, [editingUser, createUser, updateUser]);

    const handleDelete = useCallback(async (id: string) => {
        console.log('🗑️ handleDelete called with id:', id);

        if (!id) {
            console.error('❌ handleDelete: No user ID provided');
            setToast('Erro: ID do utilizador não fornecido');
            return;
        }

        if (!confirm('Tem certeza que deseja eliminar este utilizador?')) {
            console.log('❌ handleDelete: User cancelled deletion');
            return;
        }

        try {
            console.log('🔄 handleDelete: Calling deleteUser API...');
            await deleteUser(id);
            console.log('✅ handleDelete: User deleted successfully');
            setToast('Utilizador eliminado com sucesso');
            setSelectedUsers(prev => prev.filter(uid => uid !== id));
        } catch (error) {
            console.error('❌ handleDelete: Error deleting user:', error);
            setToast('Erro ao eliminar utilizador');
        }
    }, [deleteUser]);

    const resetTwoFactor = useCallback(async (id: string) => {
        if (!confirm('Tem a certeza que deseja resetar o 2FA deste utilizador?')) return;
        try {
            await resetUserTwoFactor(id);
            setToast('2FA resetado com sucesso');
        } catch (error) {
            setToast('Erro ao resetar 2FA');
        }
    }, [resetUserTwoFactor]);

    // Export functionality
    const exportUsers = useCallback((userIds?: string[]) => {
        const usersToExport = userIds
            ? users.filter((u: User) => userIds.includes(u.id))
            : users;

        const headers = ['Nome', 'Email', 'Telefone', 'Tipo', 'Status', 'Verificado', 'Data Criação'];
        const rows = usersToExport.map((user: User) => [
            `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            user.email,
            user.phone || '',
            user.role || 'Cliente',
            user.isActive ? 'Ativo' : 'Inativo',
            user.isVerified ? 'Sim' : 'Não',
            new Date(user.createdAt).toLocaleDateString('pt-PT')
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `utilizadores_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setToast('Exportação concluída');
    }, [users]);

    // Bulk action handlers
    const handleBulkAction = useCallback(async (action: BulkAction['type']) => {
        if (selectedUsers.length === 0) {
            setToast('Selecione utilizadores para realizar a ação');
            return;
        }

        try {
            switch (action) {
                case 'activate':
                    // TODO: Implement bulk activate
                    setToast(`${selectedUsers.length} utilizadores ativados`);
                    break;
                case 'deactivate':
                    // TODO: Implement bulk deactivate
                    setToast(`${selectedUsers.length} utilizadores desativados`);
                    break;
                case 'delete':
                    if (confirm(`Eliminar ${selectedUsers.length} utilizadores?`)) {
                        // TODO: Implement bulk delete
                        setToast(`${selectedUsers.length} utilizadores eliminados`);
                    }
                    break;
                case 'export':
                    exportUsers(selectedUsers);
                    break;
                case 'sendEmail':
                    setIsCommunicationModalOpen(true);
                    break;
            }
            setSelectedUsers([]);
        } catch (error) {
            setToast('Erro ao executar ação em lote');
        }
    }, [selectedUsers, exportUsers]);

    // Modal handlers
    const openCreateModal = useCallback(() => {
        setEditingUser(null);
        setIsCreateModalOpen(true);
    }, []);

    const closeModals = useCallback(() => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        setIsCommunicationModalOpen(false);
        setIsImportModalOpen(false);
        setIsAuditModalOpen(false);
        setIsPermissionsModalOpen(false);
        setEditingUser(null);
    }, []);

    return {
        // Data
        users,
        stats,
        totalUsers,
        totalPages,
        isLoading,
        error,

        // User states
        editingUser,
        selectedUsers,
        toast,
        setToast,

        // Filters
        filters,
        isFiltersOpen,
        setIsFiltersOpen,
        handleFilterChange,
        clearFilters,

        // Modal states
        isCreateModalOpen,
        isEditModalOpen,
        isDetailModalOpen,
        isCommunicationModalOpen,
        isImportModalOpen,
        isAuditModalOpen,
        isPermissionsModalOpen,
        setIsCommunicationModalOpen,
        setIsImportModalOpen,
        setIsAuditModalOpen,
        setIsPermissionsModalOpen,

        // Handlers
        handleSelectUser,
        handleSelectAll,
        handleEdit,
        handleViewDetails,
        handleSaveUser,
        handleDelete,
        resetTwoFactor,
        handleBulkAction,
        exportUsers,
        openCreateModal,
        closeModals,

        // Mutation states
        isCreating,
        isUpdating,

        // API functions
        sendCommunication,
        bulkImportUsers,
        refetch,
    };
}

export default useUserManagement;
