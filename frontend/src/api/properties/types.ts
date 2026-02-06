import type { PropertiesListResponse, Property, SystemSettings } from '@/types';

export type { PropertiesListResponse, Property, SystemSettings };

// Property Image type
export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  alt: string | null;
  order: number;
  createdAt: string;
}

// Property Query Parameters
export interface PropertyQueryParams {
  q?: string;
  status?: string;
  type?: string;
  adminStatus?: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  agentId?: string;
  cursor?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Image Upload Options
export interface ImageUploadOptions {
  transform?: 'original' | 'resize' | 'cover';
  width?: number;
  height?: number;
  quality?: number;
  onProgress?: (percent: number) => void;
  onImageProgress?: (imageIndex: number, percent: number) => void;
}
