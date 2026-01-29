import { useMessages, useProperties } from '@/api/queries';
import AgentLayout from '@/components/layouts/AgentLayout';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
    ArrowRight,
    Building,
    CheckCircle,
    Clock,
    Mail,
    RefreshCw,
    TrendingUp
} from 'lucide-react';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'up' | 'down' | 'neutral';
    color?: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon, change, changeType = 'neutral', color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        green: 'bg-green-500/10 text-green-600 border-green-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${changeType === 'up' ? 'text-green-600' :
                                changeType === 'down' ? 'text-red-600' : 'text-gray-500'
                            }`}>
                            <TrendingUp className={`w-4 h-4 ${changeType === 'down' ? 'rotate-180' : ''}`} />
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function AgentDashboard() {
    const { user } = useAuth();

    // Fetch agent's properties
    const { data: propertiesData, isLoading: loadingProperties, refetch: refetchProperties } = useProperties({
        agentId: user?.id,
        limit: 100,
    });

    // Fetch agent's messages
    const { data: messagesData, isLoading: loadingMessages, refetch: refetchMessages } = useMessages({
        agentId: user?.id,
        limit: 10,
    });

    // Stats
    const stats = useMemo(() => {
        const properties = propertiesData?.data || [];
        const messages = messagesData?.data || [];

        const activeProperties = properties.filter((p: any) => p.adminStatus === 'ACTIVE').length;
        const pendingProperties = properties.filter((p: any) => p.adminStatus === 'PENDING').length;
        const unreadMessages = messages.filter((m: any) => !m.read).length;

        return {
            totalProperties: properties.length,
            activeProperties,
            pendingProperties,
            totalMessages: messages.length,
            unreadMessages,
        };
    }, [propertiesData, messagesData]);

    const isLoading = loadingProperties || loadingMessages;

    const handleRefresh = () => {
        refetchProperties();
        refetchMessages();
    };

    return (
        <AgentLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Olá, {user?.firstName || 'Agente'}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Aqui está o resumo da sua atividade
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total de Imóveis"
                        value={stats.totalProperties}
                        icon={<Building className="w-6 h-6" />}
                        color="blue"
                    />
                    <StatCard
                        title="Imóveis Ativos"
                        value={stats.activeProperties}
                        icon={<CheckCircle className="w-6 h-6" />}
                        color="green"
                    />
                    <StatCard
                        title="Aguardando Aprovação"
                        value={stats.pendingProperties}
                        icon={<Clock className="w-6 h-6" />}
                        color="yellow"
                    />
                    <StatCard
                        title="Mensagens"
                        value={stats.unreadMessages > 0 ? `${stats.unreadMessages} novas` : stats.totalMessages.toString()}
                        icon={<Mail className="w-6 h-6" />}
                        color="purple"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Properties */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Últimos Imóveis</h2>
                            <Link
                                to="/agent/properties"
                                className="text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-1"
                            >
                                Ver todos <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loadingProperties ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse flex gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : propertiesData?.data && propertiesData.data.length > 0 ? (
                            <div className="space-y-4">
                                {propertiesData.data.slice(0, 5).map((property: any) => (
                                    <div key={property.id} className="flex gap-4 items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        {property.imageUrl ? (
                                            <img
                                                src={property.imageUrl}
                                                alt={property.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Building className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                                            <p className="text-sm text-gray-500 truncate">{property.location}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${property.adminStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                property.adminStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {property.adminStatus === 'ACTIVE' ? 'Ativo' :
                                                property.adminStatus === 'PENDING' ? 'Pendente' : 'Inativo'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <Building className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>Ainda não tem imóveis associados</p>
                                <Link to="/agent/properties" className="text-sky-600 hover:underline text-sm mt-1 block">
                                    Adicionar imóvel
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Messages */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Mensagens Recentes</h2>
                            <Link
                                to="/agent/messages"
                                className="text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-1"
                            >
                                Ver todas <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loadingMessages ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse flex gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : messagesData?.data && messagesData.data.length > 0 ? (
                            <div className="space-y-4">
                                {messagesData.data.slice(0, 5).map((message: any) => (
                                    <Link
                                        key={message.id}
                                        to="/agent/messages"
                                        className={`flex gap-4 items-start p-3 rounded-lg transition-colors ${message.read ? 'hover:bg-gray-50' : 'bg-sky-50/50 hover:bg-sky-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${message.read ? 'bg-gray-400' : 'bg-sky-600'
                                            }`}>
                                            {message.fromName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-medium truncate ${message.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {message.fromName || message.fromEmail}
                                                </h3>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                    {format(new Date(message.createdAt), 'dd MMM', { locale: pt })}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${message.read ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {message.body}
                                            </p>
                                        </div>
                                        {!message.read && (
                                            <span className="w-2 h-2 bg-sky-600 rounded-full mt-2" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <Mail className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>Nenhuma mensagem recebida</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}
