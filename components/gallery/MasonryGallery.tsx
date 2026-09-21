'use client';

import { motion } from 'framer-motion';
import { SmartImage } from '@/components/ui/SmartImage';

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  category: string;
  projectTitle: string;
  projectSlug: string;
}

export function MasonryGallery({
  photos,
  onSelect,
}: {
  photos: GalleryPhoto[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
      {photos.map((photo, index) => (
        <motion.button
          layout
          key={photo.id}
          onClick={() => onSelect(index)}
          data-cursor="VIEW"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="group relative block w-full break-inside-avoid overflow-hidden text-left"
        >
          <div className="relative w-full" style={{ aspectRatio: index % 3 === 0 ? '3 / 4' : '4 / 5' }}>
            <SmartImage
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-[1000ms] ease-cinematic group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
            <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="font-sans text-[10px] uppercase tracking-widest text-brass">
                {photo.category}
              </p>
              <p className="font-serif text-sm text-ink-50">{photo.projectTitle}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
