import type { User, UsersTableProps } from '@/types/user-management.types';
import { Inbox, Users } from 'lucide-react';
import React from 'react';
import UserRow from './UserRow';

/**
 * UsersTable Component
 * Professional data table with dark mode support
 */
const UsersTable: React.FC<UsersTableProps> = ({
    users,
    selectedUsers,
    isLoading,
    onEdit,
    onDelete,
    onViewDetails,
    onSelectUser,
    onSelectAll,
    onResetTwoFactor
}) => {
    const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
    const isSomeSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="animate-pulse">
                    {/* Header skeleton */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
                        <div className="flex gap-4">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                            <div className="flex-1 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                            <div className="w-20 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                            <div className="w-20 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                            <div className="w-16 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                            <div className="w-24 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                        </div>
                    </div>
                    {/* Row skeletons */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-4 py-4 border-b border-gray-100 dark:border-dark-border">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-dark-border rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="w-32 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                                        <div className="w-48 h-3 bg-gray-200 dark:bg-dark-border rounded"></div>
                                    </div>
                                </div>
                                <div className="w-24 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                                <div className="w-16 h-6 bg-gray-200 dark:bg-dark-border rounded-full"></div>
                                <div className="w-16 h-6 bg-gray-200 dark:bg-dark-border rounded-full"></div>
                                <div className="w-20 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-dark-border rounded"></div>
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-dark-border rounded"></div>
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-dark-border rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border 
                      py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center">
                        <Inbox size={32} className="text-gray-400 dark:text-dark-muted" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text">
                            Nenhum utilizador encontrado
                        </h3>
                        <p className="text-gray-500 dark:text-dark-muted mt-1">
                            Tente ajustar os filtros ou criar um novo utilizador.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border shadow-sm flex flex-col min-h-[400px]" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            <div className="overflow-auto custom-scrollbar flex-1 h-full">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
                            <th className="px-4 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = isSomeSelected;
                                    }}
                                    onChange={onSelectAll}
                                    className="w-4 h-4 text-primary-600 border-gray-300 dark:border-dark-border rounded 
                             focus:ring-primary-500 dark:bg-dark-card"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wider">
                                Utilizador
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wider">
                                Telefone
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wider">
                                2FA
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wider">
                                Criado em
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: User) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                isSelected={selectedUsers.includes(user.id)}
                                onSelect={onSelectUser}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewDetails={onViewDetails}
                                onResetTwoFactor={onResetTwoFactor}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Selection info bar */}
            {selectedUsers.length > 0 && (
                <div className="px-4 py-3 bg-primary-50 dark:bg-primary-900/20 border-t border-primary-100 dark:border-primary-800
                        flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400">
                        <Users size={16} />
                        <span>{selectedUsers.length} utilizador{selectedUsers.length > 1 ? 'es' : ''} selecionado{selectedUsers.length > 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable;
