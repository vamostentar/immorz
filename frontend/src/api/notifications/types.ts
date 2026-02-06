// ============================================
// Notification Types
// ============================================

export type NotificationType =
  | 'AGENT_APPROVED'
  | 'AGENT_REJECTED'
  | 'PROPERTY_APPROVED'
  | 'PROPERTY_REJECTED'
  | 'PROPERTY_PENDING'
  | 'NEW_MESSAGE'
  | 'SYSTEM_ALERT'
  | 'MARKETING';

export type NotificationChannel = 'EMAIL' | 'IN_APP' | 'SMS' | 'PUSH';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  sentAt?: string;
  failedAt?: string;
  errorReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  type?: NotificationType;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

// ============================================
// Approval Types
// ============================================

export type ApprovalEntity = 'AGENT' | 'PROPERTY' | 'DOCUMENT';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Approval {
  id: string;
  entityType: ApprovalEntity;
  entityId: string;
  status: ApprovalStatus;
  requestedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalQueryParams {
  status?: ApprovalStatus;
  entityType?: ApprovalEntity;
  limit?: number;
  offset?: number;
}

export interface ApprovalStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
  byEntityType: {
    AGENT: number;
    PROPERTY: number;
    DOCUMENT: number;
  };
}

export interface ApproveApprovalPayload {
  id: string;
  notes?: string;
}

export interface RejectApprovalPayload {
  id: string;
  notes: string; // Required for rejection
}

// ============================================
// Audit Log Types
// ============================================

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  approvalId?: string;
}

export interface AuditLogQueryParams {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
