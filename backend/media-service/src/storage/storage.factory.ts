import { GCSStorage } from './storage.gcs';
import { LocalStorage } from './storage.local';
import { S3Storage } from './storage.s3';

export interface UploadResult {
  key: string;
  bucket: string;
  url: string;
  contentType: string;
  size?: number;
}

export interface UploadParams {
  bucket: string;
  contentType: string;
  body: NodeJS.ReadableStream;
}

export interface StorageAdapter {
  uploadStream(params: UploadParams): Promise<UploadResult>;
}

function createStorage(): StorageAdapter {
  const provider = (process.env.MEDIA_STORAGE_PROVIDER || 'local').toLowerCase();
  
  if (provider === 'gcs') return new GCSStorage();
  if (provider === 's3') return new S3Storage();
  
  return new LocalStorage();
}

export const storage: StorageAdapter = createStorage();



