'use client';

import { useMemo, useState } from 'react';
import { Project } from '@/types';
import { categories } from '@/lib/config/site';
import { projectsToPhotos } from '@/lib/utils/gallery';
import { CategoryFilter } from './CategoryFilter';
import { MasonryGallery } from './MasonryGallery';
import { Lightbox } from './Lightbox';

export function PhotographyClient({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredProjects = useMemo(
    () => (category === 'all' ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  );

  const photos = useMemo(() => projectsToPhotos(filteredProjects), [filteredProjects]);

  return (
    <div>
      <CategoryFilter
        categories={categories}
        active={category}
        onChange={(value) => {
          setCategory(value);
          setLightboxIndex(null);
        }}
      />
      <div className="mt-10">
        <MasonryGallery photos={photos} onSelect={setLightboxIndex} />
      </div>
      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
