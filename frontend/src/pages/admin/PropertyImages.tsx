import { deleteImage, reorderImages, usePropertyImages } from '@/api/queries';
import { uploadPropertyImagesImproved } from '@/api/upload-utils';
import AdminLayout from '@/components/admin/AdminLayout';
import AgentLayout from '@/components/layouts/AgentLayout';
import { Toast } from '@/components/Toast';
import { ArrowLeft, Check, GripVertical, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function PropertyImages() {
  const { id = '' } = useParams();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const Layout = isAdmin ? AdminLayout : AgentLayout;
  const backLink = isAdmin ? '/admin/properties' : '/agent/properties';

  const { data = [], refetch, isFetching } = usePropertyImages(id);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);

  // Local state for optimistic updates during drag and drop
  const [localImages, setLocalImages] = useState<any[]>([]);

  // Initialize/Update local state when data changes
  React.useEffect(() => {
    if (data) {
      setLocalImages([...data].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !id) return;
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      await uploadPropertyImagesImproved(id, files, {
        onProgress: (p: number) => setProgress(p),
      });
      await refetch();
      setToast('Imagens carregadas com sucesso');
    } catch (err) {
      setToast('Erro ao carregar imagens');
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = '';
    }
  }, [id, refetch]);

  const onDelete = useCallback(async (imageId: string) => {
    if (!confirm('Tem a certeza que deseja remover esta imagem?')) return;
    try {
      await deleteImage(imageId);
      await refetch();
      setToast('Imagem removida');
    } catch (err) {
      setToast('Erro ao remover imagem');
    }
  }, [refetch]);

  // Drag and Drop Logic
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    // Make transparent image for drag preview if needed
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    // Reorder local state naturally
    const newItems = [...localImages];
    const item = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, item);
    
    setLocalImages(newItems);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    setDraggedItem(null);
    // Commit new order to backend
    try {
      const reorderedPayload = localImages.map((img, idx) => ({ id: img.id, order: idx }));
      await reorderImages(id, reorderedPayload);
      setToast('Ordem atualizada');
      refetch(); // Ensure sync
    } catch (err) {
      console.error('Failed to commit reorder', err);
      // Revert on error? Or just toast
      setToast('Erro ao gravar nova ordem');
      refetch();
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              to={backLink} 
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Voltar para Propriedades
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Imagens</h1>
            <p className="text-gray-500 text-sm">Arraste as imagens para reordenar. A primeira imagem será a capa.</p>
          </div>
          
          <label className={`
            btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer
            flex items-center gap-2 transition-all shadow-sm
            ${uploading ? 'opacity-70 cursor-not-allowed' : ''}
          `}>
            <input 
              type="file" 
              multiple 
              accept="image/jpeg,image/png,image/webp" 
              className="hidden" 
              onChange={onUpload} 
              disabled={uploading}
            />
            {uploading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
                {progress > 0 ? `${progress}%` : 'A enviar...'}
              </span>
            ) : (
              <>
                <Upload size={18} />
                <span>Carregar Imagens</span>
              </>
            )}
          </label>
        </div>

        {/* Grid */}
        {isFetching && localImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"/>
            Carregando imagens...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localImages.map((img, idx) => (
              <div 
                key={img.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`
                  group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all
                  ${draggedItem === idx ? 'opacity-50 scale-95 ring-2 ring-blue-500 cursor-grabbing' : 'hover:shadow-md cursor-grab'}
                `}
              >
                {/* Cover Badge */}
                {idx === 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                    <Check size={12} />
                    Capa
                  </div>
                )}

                {/* Drag Handle Overlay (optional visual cue) */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-black/20 rounded cursor-grab active:cursor-grabbing text-white">
                  <GripVertical size={16} />
                </div>

                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <img 
                    src={img.url} 
                    alt={img.alt || `Imagem ${idx + 1}`} 
                    className="w-full h-full object-cover pointer-events-none" 
                    // pointer-events-none prevents image dragging interfering with div dragging
                  />
                </div>

                {/* Actions Footer */}
                <div className="p-3 bg-white border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-mono">
                    #{idx + 1}
                  </span>
                  <button 
                    onClick={() => onDelete(img.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover imagem"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* New Upload Placeholder (Dropzone visual cue could go here) */}
            {localImages.length === 0 && !isFetching && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-500">
                <ImageIcon size={48} className="mb-4 opacity-50" />
                <p className="font-medium">Nenhuma imagem carregada</p>
                <p className="text-sm mt-1">Carregue imagens para começar a galeria desta propriedade.</p>
              </div>
            )}
          </div>
        )}

        <Toast text={toast ?? ''} show={!!toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
}


