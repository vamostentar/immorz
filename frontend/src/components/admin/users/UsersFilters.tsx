import type { UsersFiltersProps } from '@/types/user-management.types';
import {
    Calendar,
    ChevronDown,
    Filter,
    RotateCcw,
    Search,
    X
} from 'lucide-react';
import React from 'react';

/**
 * UsersFilters Component
 * Advanced search and filter controls with dark mode support
 */
const UsersFilters: React.FC<UsersFiltersProps> = ({
    filters,
    onFilterChange,
    onClearFilters,
    isOpen,
    onToggle
}) => {
    const roleOptions = [
        { value: '', label: 'Todos os Tipos' },
        { value: 'admin', label: 'Administradores' },
        { value: 'moderator', label: 'Moderadores' },
        { value: 'agent', label: 'Agentes' },
        { value: 'client', label: 'Clientes' },
    ];

    const statusOptions = [
        { value: '', label: 'Todos os Estados' },
        { value: 'active', label: 'Ativos' },
        { value: 'inactive', label: 'Inativos' },
        { value: 'pending', label: 'Pendentes' },
    ];

    const sortOptions = [
        { value: 'createdAt', label: 'Data de Criação' },
        { value: 'firstName', label: 'Nome' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Tipo' },
        { value: 'lastLoginAt', label: 'Último Acesso' },
    ];

    const hasActiveFilters = filters.search || filters.role || filters.status ||
        filters.dateRange.start || filters.dateRange.end;

    return (
        <div className="space-y-4">
            {/* Search Bar and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, email ou telefone..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-dark-border rounded-lg 
                       bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                       dark:focus:ring-primary-400 transition-colors
                       placeholder:text-gray-400 dark:placeholder:text-dark-muted"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                    {filters.search && (
                        <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                         hover:text-gray-600 dark:hover:text-dark-text"
                            onClick={() => onFilterChange('search', '')}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter Toggle Button */}
                <button
                    onClick={onToggle}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors
                      ${isOpen
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400'
                            : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border'
                        }`}
                >
                    <Filter size={18} />
                    <span className="font-medium">Filtros</span>
                    {hasActiveFilters && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    )}
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-600 dark:text-dark-muted 
                       hover:text-gray-900 dark:hover:text-dark-text transition-colors"
                    >
                        <RotateCcw size={16} />
                        <span>Limpar</span>
                    </button>
                )}
            </div>

            {/* Expanded Filters Panel */}
            {isOpen && (
                <div className="p-4 bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border
                        animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
                                Tipo de Utilizador
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg 
                           bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                value={filters.role}
                                onChange={(e) => onFilterChange('role', e.target.value)}
                            >
                                {roleOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
                                Estado
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg 
                           bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                value={filters.status}
                                onChange={(e) => onFilterChange('status', e.target.value)}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
                                Data de Registo
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-muted" size={14} />
                                    <input
                                        type="date"
                                        className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 dark:border-dark-border rounded-lg 
                               bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text
                               focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        value={filters.dateRange.start}
                                        onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                                    />
                                </div>
                                <span className="text-gray-400">-</span>
                                <input
                                    type="date"
                                    className="flex-1 px-2 py-2 text-sm border border-gray-200 dark:border-dark-border rounded-lg 
                             bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={filters.dateRange.end}
                                    onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
                                Ordenar por
                            </label>
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg 
                             bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={filters.sortBy}
                                    onChange={(e) => onFilterChange('sortBy', e.target.value)}
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <button
                                    className="px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg 
                             bg-white dark:bg-dark-bg text-gray-700 dark:text-dark-text
                             hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                                    onClick={() => onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                                    title={filters.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                                >
                                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersFilters;
