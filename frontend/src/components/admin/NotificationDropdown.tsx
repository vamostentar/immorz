import {
    useMarkAllNotificationsAsRead,
    useMarkNotificationAsRead,
    useNotifications,
    useUnreadNotificationsCount,
    type NotificationType
} from '@/api/notifications';
import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    Info,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    switch (type) {
        case 'AGENT_APPROVED':
        case 'PROPERTY_APPROVED':
            return <CheckCircle className="text-green-500" size={16} />;
        case 'AGENT_REJECTED':
        case 'PROPERTY_REJECTED':
            return <XCircle className="text-red-500" size={16} />;
        case 'PROPERTY_PENDING':
            return <Clock className="text-orange-500" size={16} />;
        case 'NEW_MESSAGE':
            return <Info className="text-blue-500" size={16} />;
        default:
            return <Bell className="text-gray-500" size={16} />;
    }
};

const CheckCircle = ({ className, size }: { className?: string, size?: number }) => <Check className={className} size={size} />;
const XCircle = ({ className, size }: { className?: string, size?: number }) => <X className={className} size={size} />;

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const { data: notificationsData, isLoading } = useNotifications({ limit: 5 });
    const { data: unreadData } = useUnreadNotificationsCount();
    const markRead = useMarkNotificationAsRead();
    const markAllRead = useMarkAllNotificationsAsRead();

    const unreadCount = unreadData?.count || 0;
    const notifications = notificationsData?.data || [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative transition-colors"
                title="Notificações"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Notificações</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllRead.mutate()}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <CheckCheck size={14} />
                                Ler todas
                            </button>
                        )}
                    </div>

                    <div className="max-h-[350px] overflow-auto">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                                Carregando...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Não há notificações</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative group ${
                                            !notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                                        }`}
                                        onClick={() => !notification.isRead && markRead.mutate(notification.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                <NotificationIcon type={notification.type} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className={`text-sm font-medium truncate ${
                                                        !notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">
                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="absolute top-1/2 right-2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full group-hover:hidden" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 text-center">
                        <Link
                            to="/admin/notifications"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Ver todas as notificações
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
