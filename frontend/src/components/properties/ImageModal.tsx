import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ImageModalProps {
  images: { url: string; alt?: string | null }[];
  selectedIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  title: string;
}

export function ImageModal({ images, selectedIndex, onClose, onNext, onPrev, title }: ImageModalProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    }
    if (isRightSwipe) {
      onPrev();
    }
  };

  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose} // Close on background click
    >
      {/* Content Container - Stop propagation to prevent closing when clicking content */}
      <div 
        className="relative w-full h-full max-w-7xl mx-auto p-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/20 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
          title="Fechar (Esc)"
        >
          <X size={32} />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              disabled={selectedIndex === 0}
              className={`absolute left-4 z-20 p-3 rounded-full transition-all ${
                selectedIndex === 0 
                  ? 'text-gray-600 cursor-not-allowed hidden sm:block' 
                  : 'bg-black/20 text-white hover:bg-white/10 hover:scale-110'
              }`}
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={onNext}
              disabled={selectedIndex === images.length - 1}
              className={`absolute right-4 z-20 p-3 rounded-full transition-all ${
                selectedIndex === images.length - 1 
                  ? 'text-gray-600 cursor-not-allowed hidden sm:block' 
                  : 'bg-black/20 text-white hover:bg-white/10 hover:scale-110'
              }`}
            >
              <ChevronRight size={40} />
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="relative max-w-full max-h-[85vh] select-none">
          <img
            src={images[selectedIndex]?.url}
            alt={images[selectedIndex]?.alt || `${title} - Imagem ${selectedIndex + 1}`}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded shadow-2xl animate-in zoom-in-95 duration-300"
            draggable={false}
          />
          
          {/* Counter Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/50 backdrop-blur rounded-full text-white text-sm font-medium border border-white/10">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
}
