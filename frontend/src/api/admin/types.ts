// Types for admin data
export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  withTwoFactor: number;
  recentLogins: number;
}

export interface PropertyStatistics {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  totalValue: number;
  averagePrice: number;
  monthlyViews: number;
}

export interface DashboardStats {
  users: UserStatistics;
  properties: PropertyStatistics;
  pendingApprovals: number;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  role: string | { id: string; name: string; displayName: string };
  roleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface UserPermissions {
  role: string;
  permissions: string[];
  customPermissions: string[];
}

export interface CommunicationData {
  type: 'email' | 'notification' | 'bulk_email';
  subject: string;
  message: string;
  userIds: string[];
  template?: string;
}

export interface CommunicationResult {
  message: string;
  sentCount: number;
  errors?: string[];
}

export interface ImportUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface ImportResult {
  imported: number;
  failed: number;
  errors?: string[];
}

// Backup Types
export interface BackupItem {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'full' | 'incremental' | 'settings';
  description?: string;
}

export interface CreateBackupRequest {
  type: 'full' | 'incremental' | 'settings';
  description?: string;
}

export interface RestoreBackupRequest {
  backupId: string;
  confirmRestore: boolean;
}

// SEO Types
export interface SEOValidationResult {
  title: {
    score: number;
    status: 'success' | 'warning' | 'error';
    message: string;
    length: number;
    maxLength: number;
  };
  description: {
    score: number;
    status: 'success' | 'warning' | 'error';
    message: string;
    length: number;
    maxLength: number;
  };
  keywords: {
    score: number;
    status: 'success' | 'warning' | 'error';
    message: string;
    count: number;
  };
  overallScore: number;
}
