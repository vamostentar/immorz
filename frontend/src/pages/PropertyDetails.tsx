import { AgentProfile, fetchAgentById } from '@/api/agent-queries';
import { useIncrementPropertyViews, useProperty, usePropertyImages } from '@/api/properties';
import { Footer } from '@/components/Footer';
import { ImageModal } from '@/components/properties/ImageModal';
import { PropertyContactForm } from '@/components/properties/PropertyContactForm';
import { ArrowLeft, Bath, BedDouble, Check, Expand, Eye, Heart, Home, Info, MapPin, Ruler, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

export default function PropertyDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { data: property, isLoading: propertyLoading, error: propertyError } = useProperty(id || '');
  const { data: images = [], isLoading: imagesLoading } = usePropertyImages(id || '');
  const { mutate: incrementViews } = useIncrementPropertyViews();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);

  useEffect(() => {
    if (id) {
      incrementViews(id);
    }
  }, [id, incrementViews]);

  useEffect(() => {
    if (property?.agentId) {
      setAgentLoading(true);
      fetchAgentById(property.agentId)
        .then(setAgent)
        .catch(err => console.error('Erro ao carregar agente:', err))
        .finally(() => setAgentLoading(false));
    }
  }, [property?.agentId]);

  const handleShare = async () => {
    if (!property) return;

    const shareData = {
      title: property.title,
      text: property.description?.slice(0, 100) + '...',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao partilhar:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (propertyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('propertyDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('propertyDetails.notFound')}</h3>
          <p className="text-gray-600 mb-6">{t('propertyDetails.notFoundDesc')}</p>
          <Link to="/" className="btn btn-primary">
            {t('propertyDetails.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  const statusLabel = property.status === 'for_sale' 
    ? t('propertyDetails.forSale') 
    : property.status === 'for_rent' 
      ? t('propertyDetails.forRent') 
      : t('propertyDetails.sold');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{t('propertyDetails.back')}</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo.svg"
                alt="RibeiraZul"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-sky-700">{t('navbar.properties')}</Link>
            <Link to="#contato" className="hover:text-sky-700">{t('navbar.contact')}</Link>
            <Link to="/admin/dashboard" className="btn btn-primary text-sm">{t('navbar.login')}</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Gallery Section - Hero Style */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[500px]">
             {/* Main Image (8 cols) */}
             <div 
               className="lg:col-span-8 h-full bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer"
               onClick={() => openImageModal(0)}
             >
               {imagesLoading ? (
                 <div className="w-full h-full flex items-center justify-center animate-pulse">
                   <span className="text-gray-400">{t('loading.default')}</span>
                 </div>
               ) : images.length > 0 ? (
                 <>
                   <img 
                     src={images[selectedImageIndex !== null ? selectedImageIndex : 0]?.url || images[0]?.url} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                     alt="Destaque"
                   />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                   <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 hover:bg-white transition-colors">
                     <Expand size={16} />
                     {t('propertyDetails.viewAllPhotos', { count: images.length })}
                   </button>
                 </>
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
                   <span className="text-gray-400">{t('propertyDetails.noImages')}</span>
                 </div>
               )}
             </div>

             {/* Side Thumbnails (4 cols) */}
             <div className="hidden lg:grid lg:col-span-4 grid-rows-2 gap-4 h-full">
               {images.slice(1, 3).map((img, idx) => (
                 <div 
                   key={idx} 
                   className="w-full h-full bg-gray-200 rounded-xl overflow-hidden relative cursor-pointer group"
                   onClick={() => openImageModal(idx + 1)}
                 >
                   <img 
                     src={img.url} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                     alt={t('propertyDetails.thumbnail', { index: idx + 1 })}
                   />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                 </div>
               ))}
               {images.length < 2 && (
                 <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                   RibeiraZul
                 </div>
               )}
               {images.length < 3 && (
                 <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                   RibeiraZul
                 </div>
               )}
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  property.status === 'for_sale' ? 'bg-green-100 text-green-700' :
                  property.status === 'for_rent' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {statusLabel}
                </span>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                   <div className="flex items-center gap-1">
                     <Eye size={14} /> {((property as any).uniqueViews || property.views || 0) + 1}
                   </div>
                   <span>•</span>
                   <span>Ref: {property.id.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{i18n.language?.startsWith('en') && property.titleEn ? property.titleEn : property.title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-1 text-gray-400" />
                <span>{property.location}</span>
              </div>
            </div>


            {/* Key Features Bar */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center p-2">
                <BedDouble className="w-6 h-6 text-blue-600 mb-2" />
                <span className="font-bold text-gray-900 text-lg">{property.bedrooms || '-'}</span>
                <span className="text-xs text-gray-500 uppercase">{t('propertyDetails.bedrooms')}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-l border-gray-100">
                <Bath className="w-6 h-6 text-blue-600 mb-2" />
                <span className="font-bold text-gray-900 text-lg">{property.bathrooms || '-'}</span>
                <span className="text-xs text-gray-500 uppercase">{t('propertyDetails.bathrooms')}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-l border-gray-100">
                <Ruler className="w-6 h-6 text-blue-600 mb-2" />
                <span className="font-bold text-gray-900 text-lg">{property.area || '-'}</span>
                <span className="text-xs text-gray-500 uppercase">{t('propertyDetails.area')}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-l border-gray-100">
                <Home className="w-6 h-6 text-blue-600 mb-2" />
                <span className="font-bold text-gray-900 text-lg capitalize">{property.type || '-'}</span>
                <span className="text-xs text-gray-500 uppercase">{t('propertyDetails.type')}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none text-gray-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('propertyDetails.aboutTitle')}</h3>
              <div className="whitespace-pre-line leading-relaxed">
                {i18n.language?.startsWith('en') && property.descriptionEn ? property.descriptionEn : property.description}
              </div>
            </div>

            {/* Detailed Features */}
            {((property as any).features && (property as any).features.length > 0) && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('propertyDetails.featuresTitle')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                  {(property as any).features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('propertyDetails.locationTitle')}</h3>
              <div className="bg-gray-100 rounded-xl overflow-hidden h-80 relative shadow-inner">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
              </div>
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <Info size={14} className="mr-1" />
                {t('propertyDetails.locationApprox')}
              </div>
            </div>

          </div>

          {/* Sidebar (Right Column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Price Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-sm text-gray-500 mb-1">{t('propertyDetails.salePrice')}</div>
                <div className="text-4xl font-bold text-blue-900 mb-4">
                  {property.price.toLocaleString('pt-PT')}€
                </div>
                
                <div className="flex gap-2 mb-6">
                  <button 
                    onClick={handleShare}
                    className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                  >
                    <Share2 size={18} className="mr-2" />
                    {t('propertyDetails.share')}
                  </button>
                  <button className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">
                    <Heart size={18} className="mr-2" />
                    {t('propertyDetails.save')}
                  </button>
                </div>

                {/* Agent Short Profile */}
                {agentLoading ? (
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-100 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                ) : agent && (
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                    <img 
                      src={agent.avatar || "https://ui-avatars.com/api/?name=" + agent.firstName} 
                      alt={agent.firstName} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{agent.firstName} {agent.lastName}</div>
                      <div className="text-xs text-gray-500">{t('propertyDetails.agentRole')}</div>
                    </div>
                    <Link to={`/agent/${agent.id}`} className="ml-auto text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">
                      {t('propertyDetails.viewProfile')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div id="contact-form">
                <PropertyContactForm property={property} agentId={property.agentId} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Imagem */}
      {selectedImageIndex !== null && (
        <ImageModal
          images={images}
          selectedIndex={selectedImageIndex}
          onClose={closeImageModal}
          onNext={nextImage}
          onPrev={prevImage}
          title={property.title}
        />
      )}
      <Footer />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <Share2 size={18} className="text-sky-400" />
            <span className="font-medium">{t('propertyDetails.linkCopied')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
