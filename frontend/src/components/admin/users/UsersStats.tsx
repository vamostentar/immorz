import type { UsersStatsProps } from '@/types/user-management.types';
import {
    Briefcase,
    Clock,
    ShieldCheck,
    TrendingUp,
    UserCheck,
    UserCog,
    Users
} from 'lucide-react';
import React from 'react';

/**
 * UsersStats Component
 * Professional statistics cards with dark mode support
 */
const UsersStats: React.FC<UsersStatsProps> = ({ stats }) => {
    const statCards = [
        {
            label: 'Total de Utilizadores',
            value: stats.total,
            icon: Users,
            color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
            bgColor: 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10',
        },
        {
            label: 'Utilizadores Ativos',
            value: stats.active,
            icon: UserCheck,
            color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10',
            trend: stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%',
        },
        {
            label: 'Verificados',
            value: stats.verified,
            icon: ShieldCheck,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10',
        },
        {
            label: 'Pendentes',
            value: stats.unverified,
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10',
        },
    ];

    const roleStats = [
        { label: 'Administradores', value: stats.admins, icon: UserCog, color: 'text-purple-600 dark:text-purple-400' },
        { label: 'Agentes', value: stats.agents, icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400' },
        { label: 'Clientes', value: stats.clients, icon: Users, color: 'text-gray-600 dark:text-gray-400' },
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-xl p-5 ${stat.bgColor} 
                          border border-gray-200/50 dark:border-dark-border 
                          hover:shadow-md transition-all duration-200`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-dark-muted">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-dark-text">
                                        {stat.value.toLocaleString()}
                                    </p>
                                    {stat.trend && (
                                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                            <TrendingUp size={14} />
                                            <span>{stat.trend} do total</span>
                                        </div>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -right-4 -bottom-4 opacity-5">
                                <Icon size={80} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Role Distribution */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text mb-4">
                    Distribuição por Tipo
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    {roleStats.map((role, index) => {
                        const Icon = role.icon;
                        const percentage = stats.total > 0 ? (role.value / stats.total) * 100 : 0;
                        return (
                            <div key={index} className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Icon size={16} className={role.color} />
                                    <span className="text-sm text-gray-600 dark:text-dark-muted">{role.label}</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{role.value}</p>
                                <div className="mt-2 h-1.5 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${index === 0 ? 'bg-purple-500' :
                                                index === 1 ? 'bg-indigo-500' : 'bg-gray-400'
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UsersStats;
