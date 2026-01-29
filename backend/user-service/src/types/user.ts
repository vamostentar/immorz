/**
 * Tipos do User-Service
 * 
 * ARQUITECTURA CONSOLIDADA:
 * - Dados de identidade (email, nome, role) → auth-service
 * - Dados de perfil (bio, avatar, preferências) → user-service (este serviço)
 * 
 * UserRole foi removido deste serviço - roles são geridos pelo auth-service.
 */

import {
  ContactMethod,
  DeliveryMethod,
  Gender,
  InterestType,
  NotificationType,
  Priority,
  ProfileVisibility,
  PropertyType,
  SortBy,
  ViewMode
} from '@prisma/client';

// Re-exportar enums do Prisma (excepto UserRole que agora está no auth)
export {
  ContactMethod,
  DeliveryMethod,
  Gender,
  InterestType,
  NotificationType,
  Priority,
  ProfileVisibility,
  PropertyType,
  SortBy,
  ViewMode
};

/**
 * Perfil do utilizador - Dados estendidos
 * NÃO inclui email, firstName, lastName, role (estão no auth-service)
 */
export interface UserProfile {
  id: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  preferredContactMethod: ContactMethod;
  language: string;
  timezone: string;
  profileVisibility: ProfileVisibility;
  allowMarketing: boolean;
  allowNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Preferências do utilizador
 */
export interface UserPreferences {
  id: string;
  userId: string;
  user?: UserProfile;
  propertyTypes: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  preferredLocation?: string;
  searchRadius?: number;
  sortBy: SortBy;
  viewMode: ViewMode;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  priceDropAlerts: boolean;
  newPropertyAlerts: boolean;
  marketUpdateAlerts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interesse em propriedade
 */
export interface PropertyInterest {
  id: string;
  userId: string;
  user?: UserProfile;
  propertyId: string;
  interestType: InterestType;
  notes?: string;
  priority: Priority;
  isActive: boolean;
  contacted: boolean;
  contactedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Propriedade guardada (favorito)
 */
export interface SavedProperty {
  id: string;
  userId: string;
  user?: UserProfile;
  propertyId: string;
  folder?: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Histórico de pesquisa
 */
export interface SearchHistory {
  id: string;
  userId: string;
  user?: UserProfile;
  query?: string;
  location?: string;
  propertyType: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  resultsCount?: number;
  searchTime?: number;
  createdAt: Date;
}

/**
 * Notificação
 */
export interface Notification {
  id: string;
  userId: string;
  user?: UserProfile;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  isArchived: boolean;
  archivedAt?: Date;
  deliveryMethod: DeliveryMethod;
  sentAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Request/Response DTOs
// ============================================================

export interface CreateProfileRequest {
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferredContactMethod?: ContactMethod;
  language?: string;
  timezone?: string;
  profileVisibility?: ProfileVisibility;
  allowMarketing?: boolean;
  allowNotifications?: boolean;
}

export interface UpdateProfileRequest {
  bio?: string;
  avatar?: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  preferredContactMethod?: ContactMethod;
  language?: string;
  timezone?: string;
  profileVisibility?: ProfileVisibility;
  allowMarketing?: boolean;
  allowNotifications?: boolean;
}

export interface ProfileResponse {
  id: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferredContactMethod: ContactMethod;
  language: string;
  timezone: string;
  profileVisibility: ProfileVisibility;
  allowMarketing: boolean;
  allowNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPreferencesRequest {
  propertyTypes?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  preferredLocation?: string;
  searchRadius?: number;
  sortBy?: SortBy;
  viewMode?: ViewMode;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  priceDropAlerts?: boolean;
  newPropertyAlerts?: boolean;
  marketUpdateAlerts?: boolean;
}

export interface UserPreferencesResponse {
  id: string;
  userId: string;
  propertyTypes: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  preferredLocation?: string;
  searchRadius?: number;
  sortBy: SortBy;
  viewMode: ViewMode;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  priceDropAlerts: boolean;
  newPropertyAlerts: boolean;
  marketUpdateAlerts: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyInterestRequest {
  propertyId: string;
  interestType: InterestType;
  notes?: string;
  priority?: Priority;
}

export interface PropertyInterestResponse {
  id: string;
  userId: string;
  propertyId: string;
  interestType: InterestType;
  notes?: string;
  priority: Priority;
  isActive: boolean;
  contacted: boolean;
  contactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedPropertyRequest {
  propertyId: string;
  folder?: string;
  notes?: string;
  tags?: string[];
}

export interface SavedPropertyResponse {
  id: string;
  userId: string;
  propertyId: string;
  folder?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  deliveryMethod?: DeliveryMethod;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  deliveryMethod: DeliveryMethod;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Query Parameters
// ============================================================

export interface ProfileQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  isRead?: boolean;
  isArchived?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'readAt';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================
// API Response Wrappers
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
