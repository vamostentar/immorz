import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { StorageAdapter, UploadParams, UploadResult } from './storage.factory';

export class LocalStorage implements StorageAdapter {
  private baseDir: string;

  constructor() {
    // Determine base upload directory (can be from env)
    this.baseDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    if (!existsSync(this.baseDir)) {
      mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async uploadStream(params: UploadParams): Promise<UploadResult> {
    const { bucket, contentType, body } = params;
    
    // Ensure bucket directory exists
    const bucketDir = path.join(this.baseDir, bucket);
    if (!existsSync(bucketDir)) {
      mkdirSync(bucketDir, { recursive: true });
    }

    // Generate unique filename/key
    const extension = this.getExtension(contentType);
    const key = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    const filePath = path.join(bucketDir, key);

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      let size = 0;

      body.on('data', (chunk) => {
        size += chunk.length;
      });

      body.pipe(writeStream);

      writeStream.on('finish', () => {
        // Construct public URL
        // In local mode, we assume the server serves /uploads prefix
        // e.g. http://localhost:8088/uploads/images/filename.jpg
        const publicUrl = `${process.env.API_URL || ''}/uploads/${bucket}/${key}`;

        resolve({
          key,
          bucket,
          url: publicUrl,
          contentType,
          size
        });
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  private getExtension(contentType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/avif': '.avif',
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/zip': '.zip',
      'text/plain': '.txt'
    };
    return map[contentType] || '.bin';
  }
}
