import type { Project } from '@/types';
import { projectsToPhotos } from '@/lib/utils/gallery';

/** One frame of a full-bleed slideshow. */
export interface SlidePhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  slug: string;
  category: string;
}

/** Safety cap so a very large portfolio never mounts an unbounded slideshow. */
const MAX_SLIDES = 40;

/**
 * Matches a Cloudinary delivery URL that this site built itself
 * (see cldImage in lib/cloudinary — it always adds `f_auto`).
 */
const CLD_TRANSFORMED = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)([^/]*f_auto[^/]*)\/(.+)$/;

/**
 * Gallery photos are cropped 4:5 (portrait). A full-bleed slide is wide,
 * so re-crop from the original public ID instead of stretching the
 * portrait crop. Any other URL is returned untouched.
 */
export function toSlideSrc(src: string): string {
  const match = CLD_TRANSFORMED.exec(src);
  if (!match) return src;
  return `${match[1]}f_auto,q_auto,w_2000,h_1250,c_fill,g_auto/${match[3]}`;
}

/**
 * Builds the slideshow list from the same projects the Photography page
 * shows, in the same order — so every photo added to Photography appears
 * in the slideshow automatically.
 *
 * Generated placeholder art is skipped whenever at least one real photo
 * exists. If there are no real photos yet (demo mode), each project's
 * cover is used so the slideshow is never empty.
 */
export function projectsToSlides(projects: Project[], max = MAX_SLIDES): SlidePhoto[] {
  const gallery = projectsToPhotos(projects);
  const real = gallery.filter((p) => !p.src.startsWith('data:'));

  const pool =
    real.length > 0
      ? real.map((p) => ({
          id: p.id,
          src: p.src,
          alt: p.alt,
          title: p.projectTitle,
          slug: p.projectSlug,
          category: p.category,
        }))
      : projects.map((p) => ({
          id: p.id,
          src: p.cover_image,
          alt: p.title,
          title: p.title,
          slug: p.slug,
          category: p.category,
        }));

  const seen = new Set<string>();
  const slides: SlidePhoto[] = [];
  for (const item of pool) {
    const src = toSlideSrc(item.src);
    if (seen.has(src)) continue;
    seen.add(src);
    slides.push({ ...item, src });
    if (slides.length >= max) break;
  }
  return slides;
}
