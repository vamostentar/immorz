import type { Property } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { StatusDropdown } from '../StatusDropdown';
import MultiImageUpload from './MultiImageUpload';

const schema = z.object({
  title: z.string().min(3),
  location: z.string().min(3),
  price: z.number().min(0),
  status: z.enum(['for_sale', 'for_rent', 'sold']),
  adminStatus: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']).default('ACTIVE'),
  type: z.enum(['apartamento', 'moradia', 'loft', 'penthouse', 'estudio', 'escritorio', 'terreno']).optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  titleEn: z.string().max(200).optional().nullable(),
  descriptionEn: z.string().max(2000).optional().nullable(),
  bedrooms: z.number().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
  area: z.number().min(0).optional().nullable(),
  garage: z.boolean().default(false),
  pool: z.boolean().default(false),
  energyRating: z.string().max(5).optional().nullable(),
  features: z.array(z.string()).default([]),
});

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

export type PropertyFormValues = z.infer<typeof schema>;

export interface PropertyFormRef {
  updateImageProgress: (imageIndex: number, progress: number, status?: 'pending' | 'uploading' | 'success' | 'error', url?: string) => void;
  updateAllImagesStatus: (status: 'pending' | 'uploading' | 'success' | 'error') => void;
  clearImages: () => void;
  startUpload: () => void;
}

const PropertyForm = forwardRef<PropertyFormRef, {
  initial?: Partial<Property>;
  submitting?: boolean;
  onSubmit: (values: PropertyFormValues, images?: UploadedImage[]) => void | Promise<void>;
  onImagesUpdate?: (images: UploadedImage[]) => void;
}>(({ initial, onSubmit, submitting, onImagesUpdate }, ref) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PropertyFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: initial?.title ?? '',
      location: initial?.location ?? '',
      price: Number(initial?.price ?? 0),
      status: (initial?.status as any) ?? 'for_sale',
      adminStatus: (initial?.adminStatus as any) ?? 'ACTIVE',
      type: (initial?.type as any) ?? undefined,
      imageUrl: initial?.imageUrl ?? undefined,
      description: initial?.description ?? undefined,
      titleEn: initial?.titleEn ?? undefined,
      descriptionEn: initial?.descriptionEn ?? undefined,
      bedrooms: initial?.bedrooms ?? undefined,
      bathrooms: initial?.bathrooms ?? undefined,
      area: initial?.area ?? undefined,
      garage: initial?.garage ?? false,
      pool: initial?.pool ?? false,
      energyRating: initial?.energyRating ?? undefined,
      features: initial?.features ?? [],
    },
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [langTab, setLangTab] = useState<'pt' | 'en'>('pt');
  const multiImageUploadRef = useRef<any>(null);

  // Expor funções para o componente pai
  useImperativeHandle(ref, () => ({
    updateImageProgress: (imageIndex: number, progress: number, status?: 'pending' | 'uploading' | 'success' | 'error', url?: string) => {
      console.log(`🔄 PropertyForm: updateImageProgress chamado para imagem ${imageIndex}: ${progress}%`);
      if (multiImageUploadRef.current?.updateImageProgress) {
        multiImageUploadRef.current.updateImageProgress(imageIndex, progress, status, url);
      } else {
        console.warn(`⚠️ PropertyForm: multiImageUploadRef.current não está disponível`);
      }
    },
    updateAllImagesStatus: (status: 'pending' | 'uploading' | 'success' | 'error') => {
      console.log(`🔄 PropertyForm: updateAllImagesStatus chamado com status: ${status}`);
      if (multiImageUploadRef.current?.updateAllImagesStatus) {
        multiImageUploadRef.current.updateAllImagesStatus(status);
      } else {
        console.warn(`⚠️ PropertyForm: multiImageUploadRef.current não está disponível`);
      }
    },
    // Nova função para limpar o estado das imagens após sucesso
    clearImages: () => {
      console.log(`🔄 PropertyForm: clearImages chamado`);
      setImages([]);
      if (onImagesUpdate) {
        onImagesUpdate([]);
      }
    },
    // Nova função para iniciar o upload (mudar status de 'pending' para 'uploading')
    startUpload: () => {
      console.log(`🚀 PropertyForm: startUpload chamado`);
      if (multiImageUploadRef.current?.startUpload) {
        multiImageUploadRef.current.startUpload();
      } else {
        console.warn(`⚠️ PropertyForm: multiImageUploadRef.current.startUpload não está disponível`);
      }
    },
  }));

  // Handler para quando as imagens são selecionadas/uploadadas
  const handleImagesChange = (newImages: UploadedImage[]) => {
    setImages(newImages);
    // Notificar o componente pai sobre mudanças nas imagens
    if (onImagesUpdate) {
      onImagesUpdate(newImages);
    }
  };

  return (
    <form onSubmit={handleSubmit(((values: any) => onSubmit(values, images)) as any)} className="grid gap-4">
      {/* Language Tab Strip */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setLangTab('pt')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
            langTab === 'pt' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🇵🇹 Português
        </button>
        <button
          type="button"
          onClick={() => setLangTab('en')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
            langTab === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      {/* PT fields */}
      {langTab === 'pt' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Título <span className="text-red-500">*</span></label>
            <input className="input" placeholder="Título" {...register('title')} />
            {errors.title?.message && <span className="text-red-600 text-sm">{errors.title.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea className="input" rows={4} placeholder="Descrição (opcional)" {...register('description')} />
          </div>
        </>
      )}

      {/* EN fields */}
      {langTab === 'en' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Title (EN)</label>
            <input className="input" placeholder="Title in English (optional)" {...register('titleEn')} />
            <span className="text-xs text-gray-400">Leave blank to show Portuguese version</span>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description (EN)</label>
            <textarea className="input" rows={4} placeholder="Description in English (optional)" {...register('descriptionEn')} />
            <span className="text-xs text-gray-400">Leave blank to show Portuguese version</span>
          </div>
        </>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Localização</label>
        <input className="input" placeholder="Localização" {...register('location')} />
        {errors.location?.message && <span className="text-red-600 text-sm">{errors.location.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Preço (€)</label>
        <input className="input" placeholder="Preço" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
        {errors.price?.message && <span className="text-red-600 text-sm">{errors.price.message}</span>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Estado da Oferta</label>
          <select className="input" {...register('status')}>
            <option value="for_sale">Para venda</option>
            <option value="for_rent">Para arrendar</option>
            <option value="sold">Vendido</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Estado Administrativo</label>
          <StatusDropdown
            value={watch('adminStatus') || 'ACTIVE'}
            onChange={(value) => setValue('adminStatus', value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tipo de Imóvel</label>
          <select className="input" {...register('type')}>
            <option value="">Tipo (opcional)</option>
            <option value="apartamento">Apartamento</option>
            <option value="moradia">Moradia</option>
            <option value="loft">Loft</option>
            <option value="penthouse">Penthouse</option>
            <option value="estudio">Estúdio</option>
            <option value="escritorio">Escritório</option>
            <option value="terreno">Terreno</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Certificado Energético</label>
          <select className="input" {...register('energyRating')}>
            <option value="">Nenhum</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
          </select>
        </div>
      </div>

      {/* Características da propriedade */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nº de quartos</label>
          <input
            className="input"
            placeholder="Nº de quartos"
            type="number"
            min="0"
            {...register('bedrooms', { valueAsNumber: true })}
          />
          {errors.bedrooms?.message && <span className="text-red-600 text-sm">{errors.bedrooms.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nº de casas de banho</label>
          <input
            className="input"
            placeholder="Nº de casas de banho"
            type="number"
            min="0"
            step="0.5"
            {...register('bathrooms', { valueAsNumber: true })}
          />
          {errors.bathrooms?.message && <span className="text-red-600 text-sm">{errors.bathrooms.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Área (m²)</label>
          <input
            className="input"
            placeholder="Área (m²)"
            type="number"
            min="0"
            {...register('area', { valueAsNumber: true })}
          />
          {errors.area?.message && <span className="text-red-600 text-sm">{errors.area.message}</span>}
        </div>
      </div>

      {/* Garagem e Piscina */}
      <div className="flex gap-6 p-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 transition-colors"
            {...register('garage')}
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-sky-600 transition-colors">Garagem</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 transition-colors"
            {...register('pool')}
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-sky-600 transition-colors">Piscina</span>
        </label>
      </div>

      {/* Features checkboxes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Características Adicionais</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
          {[
            'Jardim', 'Ar Condicionado', 'Aquecimento Central', 'Cozinha Equipada', 
            'Mobilado', 'Varanda', 'Terraço', 'Elevador', 'Painéis Solares',
            'Sistemas de Segurança', 'Vista de Mar', 'Vista de Rio', 'Vista de Cidade'
          ].map(feature => (
            <label key={feature} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                value={feature}
                className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 transition-colors"
                {...register('features')}
              />
              <span className="text-xs text-gray-600 group-hover:text-sky-600 transition-colors">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Upload de múltiplas imagens */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagens da Propriedade
        </label>
        <MultiImageUpload
          ref={multiImageUploadRef}
          value={images}
          onChange={handleImagesChange}
          maxFiles={10}
          maxFileSize={10}
          disabled={submitting}
        />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'A guardar...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
});

PropertyForm.displayName = 'PropertyForm';

// Exportar tipos e funções auxiliares
export { MultiImageUpload };
export type { UploadedImage };
export default PropertyForm;


