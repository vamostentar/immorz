import { useDashboardStats } from '@/api/admin-queries';
import { useMessages } from '@/api/queries';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  BarChart3,
  Bell,
  Building,
  LogOut,
  Mail,
  Moon,
  Settings,
  Sun,
  Users
} from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
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
        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </div>
      {count && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{count}</span>
      )}
    </Link>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { data: dashboardData } = useDashboardStats();
  const pendingApprovals = dashboardData?.pendingApprovals || 0;

  // Fetch unread messages count for admin (all unread)
  const { data: unreadMessages } = useMessages({
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
      case '/admin':
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/properties':
        return 'Propriedades';
      case '/admin/users':
        return 'Utilizadores';
      case '/admin/analytics':
        return 'Análises';
      case '/admin/settings':
        return 'Configurações';
      case '/admin/approvals':
        return 'Aprovações';
      case '/admin/messages':
        return 'Central de Mensagens';
      default:
        return 'Administração';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
            <div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                Admin
              </span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          <MenuItem icon={BarChart3} label="Dashboard" path="/admin/dashboard" />
          <MenuItem icon={Building} label="Propriedades" path="/admin/properties" />
          <MenuItem icon={Mail} label="Mensagens" path="/admin/messages" count={unreadCount} />
          <MenuItem icon={Users} label="Utilizadores" path="/admin/users" />
          <MenuItem icon={BarChart3} label="Análises" path="/admin/analytics" />
          <MenuItem icon={Settings} label="Configurações" path="/admin/settings" />
          <MenuItem icon={Bell} label="Aprovações" path="/admin/approvals" count={pendingApprovals} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Gerencie o seu portal imobiliário</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={resolvedTheme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              >
                {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <Bell size={20} />
                {pendingApprovals > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingApprovals}
                  </span>
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName
                        ? user.firstName
                        : user?.email
                          ? user.email.split('@')[0]
                          : 'Usuário'
                    }
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'usuario@email.com'}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.firstName
                      ? user.firstName.charAt(0).toUpperCase()
                      : user?.email
                        ? user.email.charAt(0).toUpperCase()
                        : 'U'
                    }
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                  title="Fazer logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
