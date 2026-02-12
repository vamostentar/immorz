import type { UserRowProps } from '@/types/user-management.types';
import { formatDate } from '@/utils/dateUtils';
import { Edit, Eye, Mail, MessageSquare, MoreHorizontal, Shield, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * UserRow Component
 * Table row for displaying user information with actions
 */
const UserRow: React.FC<UserRowProps> = ({
    user,
    onEdit,
    onDelete,
    onViewDetails,
    isSelected,
    onSelect,
    onResetTwoFactor
}) => {
    // DEBUG: Inspect user object failure
    useEffect(() => {
        if (!user?.email) console.warn('UserRow: User email missing', user);
    }, [user]);

    const [showActions, setShowActions] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

    const handleOpenActions = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (showActions) {
            setShowActions(false);
            return;
        }

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calcular posição (alinhado à direita do botão, abaixo dele)
            // w-48 = 12rem = 192px
            setMenuPosition({
                top: rect.bottom + 4,
                left: rect.right - 192
            });
            setShowActions(true);
        }
    };

    // Fechar ao fazer scroll na janela para evitar menu flutuando fora do sitio
    useEffect(() => {
        const handleScroll = () => {
            if (showActions) setShowActions(false);
        };
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [showActions]);

    const getName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user?.email?.split('@')[0] || 'Utilizador';
    };

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || 'U';
    };

    const getRoleDisplay = () => {
        const roleMap: Record<string, { label: string; color: string }> = {
            'SUPER_ADMIN': { label: 'Super Admin', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
            'ADMIN': { label: 'Administrador', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
            'MODERATOR': { label: 'Moderador', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            'AGENT': { label: 'Agente', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
            'CLIENT': { label: 'Cliente', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
        };
        const roleName = typeof user?.role === 'string'
            ? user.role
            : (user?.role as any)?.name || 'CLIENT';

        const role = roleName?.toUpperCase() || 'CLIENT';
        return roleMap[role] || roleMap['CLIENT'];
    };

    const getStatus = () => {
        if (!user?.isActive) {
            return { label: 'Inativo', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
        }
        // Usar isEmailVerified (do backend) com fallback para isVerified (legacy)
        const isVerified = (user as any)?.isEmailVerified ?? user?.isVerified;
        if (!isVerified) {
            return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
        }
        return { label: 'Ativo', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    };

    const roleDisplay = getRoleDisplay();
    const statusDisplay = getStatus();

    return (
        <tr className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition-colors">
            {/* Checkbox */}
            <td className="px-4 py-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(user?.id || '')}
                    className="w-4 h-4 text-primary-600 border-gray-300 dark:border-dark-border rounded 
                     focus:ring-primary-500 dark:bg-dark-card"
                />
            </td>

            {/* User Info */}
            <td className="px-4 py-4">
                <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={getName()}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-dark-border"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full 
                            flex items-center justify-center text-white font-medium text-sm shadow-sm">
                            {getInitials()}
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-gray-900 dark:text-dark-text">{getName()}</div>
                        <div className="text-sm text-gray-500 dark:text-dark-muted flex items-center gap-1">
                            <Mail size={12} />
                            {user?.email || 'Email não disponível'}
                        </div>
                    </div>
                </div>
            </td>

            {/* Phone */}
            <td className="px-4 py-4 text-sm text-gray-600 dark:text-dark-muted">
                {user?.phone || '-'}
            </td>

            {/* Role */}
            <td className="px-4 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleDisplay.color}`}>
                    <Shield size={12} />
                    {roleDisplay.label}
                </span>
            </td>

            {/* Status */}
            <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDisplay.label === 'Ativo' ? 'bg-green-500' :
                        statusDisplay.label === 'Pendente' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                    {statusDisplay.label}
                </span>
            </td>

            {/* 2FA Status */}
            <td className="px-4 py-4">
                {user.twoFactorEnabled ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                        <Shield size={12} />
                        Ativo
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        <Shield size={12} />
                        Inativo
                    </span>
                )}
            </td>

            {/* Created Date */}
            <td className="px-4 py-4 text-sm text-gray-500 dark:text-dark-muted">
                {formatDate(user?.createdAt)}
            </td>

            {/* Actions */}
            <td className="px-4 py-4">
                <div className="flex items-center justify-end space-x-1">
                    <button
                        className="p-2 text-gray-500 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400 
                       hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                        onClick={() => onViewDetails(user)}
                        title="Ver detalhes"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="p-2 text-gray-500 dark:text-dark-muted hover:text-green-600 dark:hover:text-green-400 
                       hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        onClick={() => onEdit(user)}
                        title="Editar"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className="p-2 text-gray-500 dark:text-dark-muted hover:text-red-600 dark:hover:text-red-400 
                       hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        onClick={() => onDelete(user?.id || '')}
                        title="Eliminar"
                    >
                        <Trash2 size={16} />
                    </button>

                    {/* More Actions Dropdown */}
                    <div className="relative">
                        <button
                            ref={buttonRef}
                            className="p-2 text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-dark-text 
                                     hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                            onClick={handleOpenActions}
                            title="Mais ações"
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {showActions && menuPosition && createPortal(
                            <div className="fixed inset-0 z-[9999] isolation-auto">
                                <div
                                    className="absolute inset-0 bg-transparent"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowActions(false);
                                    }}
                                />
                                <div
                                    className="absolute w-48 bg-white dark:bg-dark-card rounded-lg shadow-xl 
                                             border border-gray-200 dark:border-dark-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                                    style={{
                                        top: menuPosition.top,
                                        left: menuPosition.left,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-dark-text 
                                                 hover:bg-gray-50 dark:hover:bg-dark-border flex items-center gap-2"
                                        onClick={() => {
                                            // TODO: Implement send email
                                            setShowActions(false);
                                        }}
                                    >
                                        <Mail size={14} />
                                        Enviar Email
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-dark-text 
                                                 hover:bg-gray-50 dark:hover:bg-dark-border flex items-center gap-2"
                                        onClick={() => {
                                            // TODO: Implement send message
                                            setShowActions(false);
                                        }}
                                    >
                                        <MessageSquare size={14} />
                                        Enviar Mensagem
                                    </button>
                                    <hr className="my-1 border-gray-100 dark:border-dark-border" />
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-dark-text 
                                                 hover:bg-gray-50 dark:hover:bg-dark-border flex items-center gap-2"
                                        onClick={() => {
                                            onViewDetails(user);
                                            setShowActions(false);
                                        }}
                                    >
                                        <Shield size={14} />
                                        Gerir Permissões
                                    </button>
                                    <button
                                         className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-dark-text 
                                                  hover:bg-gray-50 dark:hover:bg-dark-border flex items-center gap-2"
                                         onClick={() => {
                                             if (onResetTwoFactor) onResetTwoFactor(user.id);
                                             setShowActions(false);
                                         }}
                                    >
                                        <Shield size={14} />
                                        Resetar 2FA
                                    </button>
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default UserRow;
