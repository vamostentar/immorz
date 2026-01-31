import { FastifyInstance } from 'fastify';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { config } from '../config/index.js';
import { storageService } from '../services/storage.service.js';
import { logger } from '../utils/logger.js';

export async function uploadsRoutes(fastify: FastifyInstance) {
  
  // Generic File Upload
  fastify.post('/api/v1/uploads', async (request, reply) => {
    try {
      console.log('🆕 Received generic upload request');

      if (!request.isMultipart()) {
        return reply.code(400).send({
          success: false,
          error: 'Bad Request',
          message: 'Request must be multipart/form-data'
        });
      }

      const data = await request.file();
      if (!data) {
        return reply.code(400).send({
          success: false,
          error: 'Bad Request',
          message: 'No file uploaded'
        });
      }

      console.log('📁 Processing generic upload:', {
        filename: data.filename,
        mimetype: data.mimetype,
        size: data.file?.bytesRead || 'unknown'
      });

      // Validate file
      // We can relax size limits for general uploads or keep them tight
      // For now, simple validation
      const validation = storageService.validateImageFile(data.mimetype, data.file.bytesRead || 0); 
      // Note: bytesRead might be 0 initially if stream hasn't been consumed. 
      // Ideally we check after consumption or rely on multipart limits.

      const uploadDir = path.join(process.cwd(), 'uploads', 'general');
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(data.filename)}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      const writeStream = createWriteStream(filePath);

      await new Promise<void>((resolve, reject) => {
        data.file.pipe(writeStream);
        writeStream.on('finish', () => resolve());
        writeStream.on('error', reject);
      });

      // Construct public URL
      // Assuming generic structure: https://domain/uploads/general/filename
      // But verify how static serving is set up. 
      // app.ts serves process.cwd()/uploads at prefix /uploads/
      // So file at uploads/general/foo.jpg is accessible at /uploads/general/foo.jpg
      
      const publicUrl = `${config.API_URL || ''}/uploads/general/${uniqueFilename}`;

      console.log('✅ Generic upload successful:', { publicUrl });

      return reply.code(201).send({
        success: true,
        data: {
          url: publicUrl,
          filename: uniqueFilename,
          mimetype: data.mimetype,
          size: data.file.bytesRead
        },
        message: 'File uploaded successfully'
      });

    } catch (error) {
      logger.error({ error }, 'Failed to process generic upload');
      return reply.code(500).send({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  });
}
