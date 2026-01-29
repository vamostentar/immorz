import { useRoles } from '@/api/admin-queries';
import type { UserFormData, UserFormProps } from '@/types/user-management.types';
import { Mail, Phone, Shield, User as UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Fallback roles quando a API não retorna dados (backup adicional)
const FALLBACK_ROLES = [
    { id: 'super_admin', name: 'super_admin', displayName: 'Super Administrador' },
    { id: 'admin', name: 'admin', displayName: 'Administrador' },
    { id: 'agent', name: 'agent', displayName: 'Agente' },
    { id: 'client', name: 'client', displayName: 'Cliente' },
];

/**
 * UserForm Component
 * Professional form for creating and editing users with dark mode support
 */
const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isSubmitting }) => {
    const { data: apiRoles, isLoading: isLoadingRoles } = useRoles();

    // Usar roles da API, garantindo que é sempre um array válido
    const roles = React.useMemo(() => {
        const result = Array.isArray(apiRoles) && apiRoles.length > 0 ? apiRoles : FALLBACK_ROLES;
        console.log('🔍 UserForm roles:', { apiRoles, result, isLoadingRoles });
        return result;
    }, [apiRoles, isLoadingRoles]);

    // Obter roleId do utilizador (pode ser ID ou nome do role)
    const getUserRoleId = () => {
        if (user?.roleId) return user.roleId;
        if (typeof user?.role === 'object' && user?.role?.id) return user.role.id;
        if (typeof user?.role === 'object' && user?.role?.name) return user.role.name;
        if (typeof user?.role === 'string') return user.role;
        return roles[0]?.id || '';
    };

    const [formData, setFormData] = useState<UserFormData>({
        email: user?.email || '',
        password: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        roleId: getUserRoleId(),
        isActive: user?.isActive ?? true,
        isVerified: (user as any)?.isEmailVerified ?? user?.isVerified ?? true,
    });

    // Update roleId when roles load and no user is being edited
    useEffect(() => {
        if (!user && roles.length > 0 && !formData.roleId) {
            setFormData(prev => ({ ...prev, roleId: roles[0]?.id || '' }));
        }
    }, [roles, user, formData.roleId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field: keyof UserFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        if (onCancel) {
            onCancel();
        } else {
            setFormData({
                email: user?.email || '',
                password: '',
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                phone: user?.phone || '',
                roleId: getUserRoleId(),
                isActive: user?.isActive ?? true,
                isVerified: (user as any)?.isEmailVerified ?? user?.isVerified ?? true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                        Email *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-muted" size={16} />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg 
                         bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                         dark:focus:ring-primary-400 transition-colors"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="utilizador@exemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                        Telefone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-muted" size={16} />
                        <input
                            type="tel"
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg 
                         bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                         dark:focus:ring-primary-400 transition-colors"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="+351 912 345 678"
                        />
                    </div>
                </div>
            </div>

            {/* Password Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    {user ? 'Nova Palavra-passe' : 'Palavra-passe *'}
                </label>
                <input
                    type="password"
                    required={!user}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg 
                     bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     dark:focus:ring-primary-400 transition-colors"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder={user ? "Deixe vazio para não alterar" : "Mínimo 8 caracteres"}
                    minLength={8}
                />
                {user && (
                    <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">
                        Deixe este campo vazio se não quiser alterar a palavra-passe
                    </p>
                )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                        Nome
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-muted" size={16} />
                        <input
                            type="text"
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg 
                         bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                         dark:focus:ring-primary-400 transition-colors"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            placeholder="João"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                        Apelido
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg 
                       bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                       dark:focus:ring-primary-400 transition-colors"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Silva"
                    />
                </div>
            </div>

            {/* Role Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Tipo de Utilizador
                </label>
                <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-muted" size={16} />
                    <select
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg 
                       bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                       dark:focus:ring-primary-400 transition-colors appearance-none"
                        value={formData.roleId}
                        onChange={(e) => handleChange('roleId', e.target.value)}
                    >
                        {!formData.roleId && (
                            <option value="" disabled>Selecione um tipo...</option>
                        )}
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.displayName || role.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative flex items-center cursor-pointer group">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-dark-border rounded-full peer 
                          peer-checked:bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary-300
                          after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                          after:bg-white after:rounded-full after:h-5 after:w-5 
                          after:transition-all peer-checked:after:translate-x-full transition-colors"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-dark-text">
                        Utilizador Ativo
                    </span>
                </label>

                <label className="relative flex items-center cursor-pointer group">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.isVerified}
                        onChange={(e) => handleChange('isVerified', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-dark-border rounded-full peer 
                          peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-green-300
                          after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                          after:bg-white after:rounded-full after:h-5 after:w-5 
                          after:transition-all peer-checked:after:translate-x-full transition-colors"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-dark-text">
                        Email Verificado
                    </span>
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-dark-border">
                <button
                    type="button"
                    className="px-4 py-2.5 text-gray-600 dark:text-dark-muted border border-gray-300 dark:border-dark-border 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors font-medium"
                    onClick={handleReset}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium
                     shadow-sm hover:shadow-md"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            A guardar...
                        </span>
                    ) : (
                        user ? 'Atualizar' : 'Criar Utilizador'
                    )}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
