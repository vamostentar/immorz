/**
 * Users Management Page
 * Main orchestrator component for user management with modular components
 */
import AdminLayout from '@/components/admin/AdminLayout';
import {
    UserAudit,
    UserCommunication,
    UserForm,
    UserImport,
    UserPermissions,
    UsersFilters,
    UsersStats,
    UsersTable
} from '@/components/admin/users';
import Modal from '@/components/Modal';
import { Toast } from '@/components/Toast';
import { useUserManagement } from '@/hooks/useUserManagement';
import {
    Download,
    Mail,
    Plus,
    RefreshCw,
    Trash2,
    Upload,
    UserCheck,
    UserX
} from 'lucide-react';

export default function UsersManagementPage() {
    const {
        // Data
        users,
        stats,
        isLoading,

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
        resetTwoFactor,
    } = useUserManagement();

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gestão de Utilizadores
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie utilizadores, permissões e atividades
                        </p>
                    </div>

                    <div className="flex items-center flex-wrap gap-3">

                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border
                         bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text
                         hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                            onClick={() => refetch()}
                            title="Atualizar lista"
                        >
                            <RefreshCw size={18} />
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-dark-text
                         hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
                            onClick={() => exportUsers()}
                        >
                            <Download size={18} />
                            <span>Exportar</span>
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
                         hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            <Upload size={18} />
                            <span>Importar</span>
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg
                         bg-primary-600 text-white shadow-sm
                         hover:bg-primary-700 hover:shadow-md transition-all"
                            onClick={openCreateModal}
                        >
                            <Plus size={18} />
                            <span>Novo Utilizador</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <UsersStats stats={stats} />

                {/* Filters */}
                <UsersFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    isOpen={isFiltersOpen}
                    onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
                />

                {/* Bulk Actions Bar */}
                {selectedUsers.length > 0 && (
                    <div className="flex items-center justify-between p-4 
                          bg-primary-50 dark:bg-primary-900/20 rounded-xl 
                          border border-primary-100 dark:border-primary-800">
                        <span className="text-primary-700 dark:text-primary-400 font-medium">
                            {selectedUsers.length} utilizador{selectedUsers.length > 1 ? 'es' : ''} selecionado{selectedUsers.length > 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                           bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400
                           hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                onClick={() => handleBulkAction('activate')}
                            >
                                <UserCheck size={16} />
                                Ativar
                            </button>
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                           bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400
                           hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                                onClick={() => handleBulkAction('deactivate')}
                            >
                                <UserX size={16} />
                                Desativar
                            </button>
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                           bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400
                           hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                onClick={() => handleBulkAction('sendEmail')}
                            >
                                <Mail size={16} />
                                Email
                            </button>
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                           bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                           hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => handleBulkAction('export')}
                            >
                                <Download size={16} />
                                Exportar
                            </button>
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                           bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400
                           hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                onClick={() => handleBulkAction('delete')}
                            >
                                <Trash2 size={16} />
                                Eliminar
                            </button>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <UsersTable
                    users={users}
                    selectedUsers={selectedUsers}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                    onSelectUser={handleSelectUser}
                    onSelectAll={handleSelectAll}
                    onResetTwoFactor={resetTwoFactor}
                />

                {/* Create User Modal */}
                <Modal
                    open={isCreateModalOpen}
                    title="Novo Utilizador"
                    onClose={closeModals}
                >
                    <UserForm
                        onSubmit={handleSaveUser}
                        onCancel={closeModals}
                        isSubmitting={isCreating}
                    />
                </Modal>

                {/* Edit User Modal */}
                <Modal
                    open={isEditModalOpen}
                    title="Editar Utilizador"
                    onClose={closeModals}
                >
                    <UserForm
                        user={editingUser}
                        onSubmit={handleSaveUser}
                        onCancel={closeModals}
                        isSubmitting={isUpdating}
                    />
                </Modal>

                {/* User Details Modal */}
                <Modal
                    open={isDetailModalOpen}
                    title="Detalhes do Utilizador"
                    onClose={closeModals}
                >
                    {editingUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full 
                                flex items-center justify-center text-white text-xl font-bold shadow-md">
                                    {editingUser.firstName?.[0]}{editingUser.lastName?.[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">
                                        {editingUser.firstName} {editingUser.lastName}
                                    </h3>
                                    <p className="text-gray-500 dark:text-dark-muted">{editingUser.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-dark-border rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">Telefone</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">{editingUser.phone || '-'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-dark-border rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">Tipo</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {typeof editingUser.role === 'string' ? editingUser.role : editingUser.role.displayName}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-dark-border rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">Estado</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {editingUser.isActive ? 'Ativo' : 'Inativo'}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-dark-border rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">Verificado</p>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {editingUser.isVerified ? 'Sim' : 'Não'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-dark-border">
                                <button
                                    className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                    onClick={() => {
                                        closeModals();
                                        handleEdit(editingUser);
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="py-2 px-4 border border-gray-200 dark:border-dark-border rounded-lg 
                             text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                                    onClick={() => setIsPermissionsModalOpen(true)}
                                >
                                    Permissões
                                </button>
                                <button
                                    className="py-2 px-4 border border-gray-200 dark:border-dark-border rounded-lg 
                             text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                                    onClick={() => setIsAuditModalOpen(true)}
                                >
                                    Histórico
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Communication Modal */}
                <Modal
                    open={isCommunicationModalOpen}
                    title="Comunicação"
                    onClose={() => setIsCommunicationModalOpen(false)}
                >
                    <UserCommunication
                        users={selectedUsers.length > 0
                            ? users.filter((u: any) => selectedUsers.includes(u.id))
                            : editingUser ? [editingUser] : []
                        }
                        onClose={() => setIsCommunicationModalOpen(false)}
                        onSend={async (data) => {
                            await sendCommunication(data);
                            setIsCommunicationModalOpen(false);
                        }}
                    />
                </Modal>

                {/* Import Modal */}
                <Modal
                    open={isImportModalOpen}
                    title="Importar Utilizadores"
                    onClose={() => setIsImportModalOpen(false)}
                >
                    <UserImport
                        onClose={() => setIsImportModalOpen(false)}
                        onImport={async (importedUsers) => {
                            await bulkImportUsers({ users: importedUsers });
                            setIsImportModalOpen(false);
                        }}
                    />
                </Modal>

                {/* Audit Modal */}
                <Modal
                    open={isAuditModalOpen}
                    title="Histórico de Atividades"
                    onClose={() => setIsAuditModalOpen(false)}
                >
                    {editingUser && (
                        <UserAudit
                            user={editingUser as any}
                            onClose={() => setIsAuditModalOpen(false)}
                        />
                    )}
                </Modal>

                {/* Permissions Modal */}
                <Modal
                    open={isPermissionsModalOpen}
                    title="Gerir Permissões"
                    onClose={() => setIsPermissionsModalOpen(false)}
                >
                    {editingUser && (
                        <UserPermissions
                            user={editingUser as any}
                            onClose={() => setIsPermissionsModalOpen(false)}
                        />
                    )}
                </Modal>

                {/* Toast */}
                <Toast
                    text={toast || ''}
                    show={!!toast}
                    onClose={() => setToast(null)}
                />
            </div>
        </AdminLayout>
    );
}
