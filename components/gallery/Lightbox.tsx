'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import type { GalleryPhoto } from './MasonryGallery';

interface LightboxProps {
  photos: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const open = index !== null;
  const photo = index !== null ? photos[index] : null;

  const goNext = () => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  };
  const goPrev = () => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/97 backdrop-blur-sm"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? goPrev : goNext)();
            touchStartX.current = null;
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center text-ink-50 transition-colors hover:text-brass"
          >
            <X size={22} />
          </button>

          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ink-50 transition-colors hover:text-brass md:left-6"
          >
            <ChevronLeft size={28} />
          </button>

          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto h-[78vh] w-[88vw] max-w-4xl"
          >
            <SmartImage src={photo.src} alt={photo.alt} fill className="object-contain" priority />
          </motion.div>

          <button
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ink-50 transition-colors hover:text-brass md:right-6"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-sans text-xs uppercase tracking-widest text-ink-100">
            <p className="mb-1 text-ink-50">{photo.projectTitle}</p>
            <p>
              {(index ?? 0) + 1} / {photos.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
