/**
 * User Management Types
 * Shared interfaces for the Users Management feature
 */

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    isActive: boolean;
    isVerified: boolean;
    role: string | { id: string; name: string; displayName: string };
    roleId?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    loginCount?: number;
}

export interface UserFormData {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: string;
    roleId: string;
    isActive: boolean;
    isVerified: boolean;
}

export interface FilterState {
    search: string;
    role: string;
    status: string;
    dateRange: {
        start: string;
        end: string;
    };
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
}

export interface BulkAction {
    type: 'activate' | 'deactivate' | 'delete' | 'export' | 'sendEmail';
    userIds: string[];
}

export interface UserFormProps {
    user?: User | null;
    onSubmit: (data: UserFormData) => void;
    onCancel?: () => void;
    isSubmitting: boolean;
}

export interface UserRowProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onViewDetails: (user: User) => void;
    isSelected: boolean;
    onSelect: (userId: string) => void;
}

export interface UsersTableProps {
    users: User[];
    selectedUsers: string[];
    isLoading: boolean;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onViewDetails: (user: User) => void;
    onSelectUser: (userId: string) => void;
    onSelectAll: (e?: any) => void;
}

export interface UsersFiltersProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: any) => void;
    onClearFilters: () => void;
    isOpen: boolean;
    onToggle: () => void;
}

export interface UsersStatsProps {
    stats: {
        total: number;
        active: number;
        inactive: number;
        verified: number;
        unverified: number;
        agents: number;
        clients: number;
        admins: number;
    };
}

export interface Role {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    color?: string;
}
