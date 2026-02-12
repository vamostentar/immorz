import { useMessages } from '@/api/queries';
import { useAuth } from '@/context/AuthContext';
import {
    BarChart3,
    Building,
    LogOut,
    Mail,
    Target,
    User
} from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AgentLayoutProps {
    children: React.ReactNode;
}

interface MenuItemProps {
    icon: React.ComponentType<any>;
    label: string;
    path: string;
    count?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, path, count }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link
            to={path}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${isActive
                ? 'bg-sky-100 text-sky-700 shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
        >
            <div className="flex items-center space-x-3">
                <Icon size={20} />
                <span className="font-medium">{label}</span>
            </div>
            {count !== undefined && count > 0 && (
                <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full">{count}</span>
            )}
        </Link>
    );
};

export default function AgentLayout({ children }: AgentLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Fetch unread messages count for agent
    const { data: unreadMessages } = useMessages({
        agentId: user?.id,
        read: false,
        limit: 1, // Only need count, not data
    });
    const unreadCount = unreadMessages?.pagination?.total || 0;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            navigate('/login');
        }
    };

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/agent':
            case '/agent/dashboard':
                return 'Dashboard';
            case '/agent/properties':
                return 'Os Meus Imóveis';
            case '/agent/messages':
                return 'Mensagens';
            case '/agent/profile':
                return 'Perfil';
            case '/agent/leadhunter':
                return 'Lead Hunter IA';
            default:
                return 'Painel do Agente';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
                {/* Logo Header */}
                <div className="p-6 border-b border-gray-200">
                    <Link to="/agent/dashboard" className="flex items-center space-x-3">
                        <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
                        <div>
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-medium">
                                Agente
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2 flex-1">
                    <MenuItem icon={BarChart3} label="Dashboard" path="/agent/dashboard" />
                    <MenuItem icon={Target} label="Lead Hunter" path="/agent/leadhunter" />
                    <MenuItem icon={Building} label="Os Meus Imóveis" path="/agent/properties" />
                    <MenuItem icon={Mail} label="Mensagens" path="/agent/messages" count={unreadCount} />
                    <MenuItem icon={User} label="Perfil" path="/agent/profile" />
                </nav>

                {/* User Info & Logout - Bottom Section */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-sky-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Terminar Sessão</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
