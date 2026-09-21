'use client';

import { useMemo, useState } from 'react';
import { Project } from '@/types';
import { projectsToPhotos } from '@/lib/utils/gallery';
import { MasonryGallery } from '@/components/gallery/MasonryGallery';
import { Lightbox } from '@/components/gallery/Lightbox';

export function ProjectGallery({ project }: { project: Project }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = useMemo(() => projectsToPhotos([project]), [project]);

  return (
    <div>
      <MasonryGallery photos={photos} onSelect={setLightboxIndex} />
      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
