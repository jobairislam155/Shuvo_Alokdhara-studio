import { Project } from '@/types';
import { GalleryPhoto } from '@/components/gallery/MasonryGallery';

export function projectsToPhotos(projects: Project[]): GalleryPhoto[] {
  const photos: GalleryPhoto[] = [];
  for (const project of projects) {
    const media = project.media?.filter((m) => m.type === 'image') ?? [];
    const items =
      media.length > 0
        ? media
        : [{ id: project.id, media_url: project.cover_image, alt_text: project.title }];
    items.forEach((item, i) => {
      photos.push({
        id: `${project.id}-${i}`,
        src: 'media_url' in item ? item.media_url : project.cover_image,
        alt: 'alt_text' in item && item.alt_text ? item.alt_text : project.title,
        category: project.category,
        projectTitle: project.title,
        projectSlug: project.slug,
      });
    });
  }
  return photos;
}
