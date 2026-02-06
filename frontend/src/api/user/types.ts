// Types for User Service

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  preferences?: {
    contactMethod?: 'EMAIL' | 'PHONE' | 'SMS';
    language?: string;
    timezone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  propertyTypes?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  location?: {
    city?: string;
    district?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    radius?: number;
  };
  bedrooms?: {
    min?: number;
    max?: number;
  };
  bathrooms?: {
    min?: number;
    max?: number;
  };
  features?: string[];
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyInterest {
  id: string;
  userId: string;
  propertyId: string;
  interestType: 'VIEWED' | 'FAVORITED' | 'CONTACTED' | 'SCHEDULED_VISIT';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  folder?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query?: string;
  location?: string;
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  resultsCount?: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'PROPERTY_ALERT' | 'PRICE_DROP' | 'NEW_MATCH' | 'SYSTEM' | 'MARKETING';
  title: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}
