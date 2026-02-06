import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { ImageUploadOptions, PropertyImage } from './types';

/**
 * Upload a single image to the media service
 */
export async function uploadMediaImage(
  file: File,
  opts?: { transform?: 'original' | 'resize' | 'cover'; width?: number; height?: number; quality?: number; onProgress?: (p: number) => void }
) {
  const form = new FormData();
  form.append('file', file);

  const { data } = await api.post('/api/v1/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (!opts?.onProgress || !evt.total) return;
      opts.onProgress(Math.round((evt.loaded * 100) / evt.total));
    },
  });

  return data?.data?.url as string | undefined;
}

/**
 * Upload multiple images to the media service (legacy/fallback wrapper)
 */
export async function uploadMultipleMediaImages(
  files: File[],
  opts?: { transform?: 'original' | 'resize' | 'cover'; width?: number; height?: number; quality?: number; onProgress?: (p: number) => void }
): Promise<string[]> {
  const uploadPromises = files.map(async (file, index) => {
    const progressCallback = opts?.onProgress
      ? (progress: number) => {
        const totalProgress = Math.round(((index * 100) + progress) / files.length);
        opts.onProgress!(totalProgress);
      }
      : undefined;

    return await uploadMediaImage(file, { ...opts, onProgress: progressCallback });
  });

  const results = await Promise.allSettled(uploadPromises);
  const urls: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      urls.push(result.value);
    } else if (result.status === 'rejected') {
      console.error(`Failed to upload file ${files[index].name}:`, result.reason);
    }
  });

  return urls;
}

/**
 * Associate an already uploaded image to a property
 */
export async function associateImageToProperty(
  propertyId: string,
  imageUrl: string,
  extra?: { alt?: string; order?: number; }
) {
  const form = new FormData();
  form.append('imageUrl', imageUrl);
  if (extra?.alt) form.append('alt', extra.alt);
  if (typeof extra?.order === 'number') form.append('order', String(extra.order));

  const { data } = await api.post(`/api/v1/properties/${propertyId}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data?.data;
}

/**
 * Upload multiple images and associate them to a property
 */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[],
  opts?: ImageUploadOptions
): Promise<string[]> {
  console.log(`🖼️ Iniciando upload de ${files.length} imagens para propriedade ${propertyId}`);

  if (!propertyId) {
    throw new Error('PropertyId é obrigatório');
  }

  if (!files || files.length === 0) {
    console.log('ℹ️ Nenhum arquivo para upload');
    return [];
  }

  // Validar arquivos
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.size > maxFileSize) {
      throw new Error(`Arquivo ${file.name} é muito grande. Máximo: 10MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não suportado: ${file.type}. Use JPEG, PNG ou WebP`);
    }

    console.log(`✅ Arquivo ${i + 1} validado:`, {
      name: file.name,
      size: `${Math.round(file.size / 1024)}KB`,
      type: file.type
    });
  }

  try {
    const results: string[] = [];
    const imageProgresses: number[] = new Array(files.length).fill(0);

    const calculateTotalProgress = (): number => {
      const totalProgress = imageProgresses.reduce((sum, progress) => sum + progress, 0);
      return Math.round(totalProgress / files.length);
    };

    if (opts?.onProgress) {
      opts.onProgress(0);
    }
    if (opts?.onImageProgress) {
      files.forEach((_, index) => {
        opts.onImageProgress!(index, 0);
      });
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📤 Fazendo upload do arquivo ${i + 1}/${files.length}: ${file.name}`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', `Imagem ${i + 1} - ${file.name}`);
      formData.append('order', String(i + 1));

      try {
        imageProgresses[i] = 1;
        if (opts?.onImageProgress) {
          opts.onImageProgress(i, 1);
        }
        if (opts?.onProgress) {
          opts.onProgress(calculateTotalProgress());
        }

        const { data } = await api.post(`/api/v1/properties/${propertyId}/images`, formData, {
          timeout: 300000, // 5 minutos
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && progressEvent.total > 0) {
              const fileProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              imageProgresses[i] = fileProgress;

              if (opts?.onImageProgress) {
                setTimeout(() => opts.onImageProgress!(i, fileProgress), 0);
              }
              if (opts?.onProgress) {
                setTimeout(() => opts.onProgress!(Math.max(1, calculateTotalProgress())), 0);
              }
            } else if (progressEvent.loaded > 0) {
              const estimatedProgress = Math.min(95, Math.round((progressEvent.loaded / file.size) * 100));
              imageProgresses[i] = estimatedProgress;

              if (opts?.onImageProgress) {
                setTimeout(() => opts.onImageProgress!(i, estimatedProgress), 0);
              }
              if (opts?.onProgress) {
                setTimeout(() => opts.onProgress!(Math.max(1, calculateTotalProgress())), 0);
              }
            }
          },
        });

        if (data?.success && data?.data) {
          console.log(`✅ Arquivo ${i + 1} upload concluído com sucesso`);
          results.push(data.data.url || data.data.filename || `uploaded-${i + 1}`);

          imageProgresses[i] = 100;
          if (opts?.onImageProgress) {
            setTimeout(() => opts.onImageProgress!(i, 100), 0);
          }
          if (opts?.onProgress) {
            setTimeout(() => opts.onProgress!(calculateTotalProgress()), 0);
          }
        } else {
          throw new Error(`Resposta inválida do servidor para arquivo ${file.name}`);
        }

      } catch (fileError) {
        console.error(`💥 Erro no upload do arquivo ${i + 1} (${file.name}):`, fileError);

        imageProgresses[i] = 0;
        if (opts?.onImageProgress) {
          setTimeout(() => opts.onImageProgress!(i, 0), 0);
        }
        if (opts?.onProgress) {
          setTimeout(() => opts.onProgress!(calculateTotalProgress()), 0);
        }

        let errorMessage = 'Erro desconhecido no upload';
        if (fileError instanceof Error) {
          errorMessage = fileError.message;
        } else if (typeof fileError === 'object' && fileError !== null) {
          const axiosError = fileError as any;
          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          } else if (axiosError.response?.data?.error) {
            errorMessage = axiosError.response.data.error;
          }
        }

        throw new Error(`Falha no upload do arquivo ${file.name}: ${errorMessage}`);
      }
    }

    if (opts?.onProgress) {
      opts.onProgress(100);
    }

    console.log(`🎉 Upload concluído com sucesso: ${results.length} imagens`);
    return results;
  } catch (error) {
    console.error('💥 Falha geral no upload das imagens:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Falha crítica no upload das imagens');
  }
}

/**
 * Delete an image by ID
 */
export async function deleteImage(imageId: string) {
  await api.delete(`/api/v1/images/${imageId}`);
}

/**
 * Reorder images for a property
 */
export async function reorderImages(propertyId: string, images: { id: string; order: number }[]) {
  await api.put(`/api/v1/properties/${propertyId}/images/reorder`, { images });
}

/**
 * Fetch images for a property
 */
export function usePropertyImages(propertyId: string) {
  return useQuery<PropertyImage[]>({
    queryKey: ['property-images', propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/properties/${propertyId}/images`);
      return data?.data ?? [];
    },
  });
}
