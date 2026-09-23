import { Project } from '@/types';
import { categoryTones, duotonePlate } from './placeholder-art';
import { cldImage, isCloudinaryConfigured } from '@/lib/cloudinary';

interface Seed {
  title: string;
  slug: string;
  category: Project['category'];
  year: number;
  location: string;
  client?: string;
  description: string;
  featured: boolean;
  frames: number;
  /**
   * Your real Cloudinary photos for this project, as public IDs — in the
   * order you want them to appear. The first one is also used as the
   * cover image. Leave empty (or omit) to keep placeholder art.
   * Example: images: ['wedding-hall-01', 'wedding-hall-02']
   */
  images?: string[];
}

const seeds: Seed[] = [
  {
    title: 'Wedding — Rangpur',
    slug: 'wedding-rangpur',
    category: 'wedding',
    year: 2026,
    location: 'Pirgachaha, Rangpur',
    client: 'Mithi & Imtiaz',
    description:
      'A cinematic documentation of the wedding day — from the quiet hours of preparation to the last dance under string lights. Shot across three venues over two days, balancing candid reportage with a handful of directed portraits.',
    featured: true,
    frames: 6,
    images: ['img30','img8','img34','img23','img33','img10','img28','img9','img22'],
  },
  {
    title: 'Portrait Series — In Studio & Outdoors',
    slug: 'portrait-series-in-studio',
    category: 'portrait',
    year: 2025,
    location: 'Rangpur, Bangladesh',
    client: 'Editorial commission',
    description:
      'A stripped-back studio series exploring light and stillness. Single-source lighting, minimal retouching, and a focus on presence over pose.',
    featured: true,
    frames: 5,
    images: ['img13','img','pexels-upenderphotography-37602134','img25','img26','img38','img21','img5','img39'],
  },
  {
    title: 'Fashion — Monsoon Collection',
    slug: 'fashion-monsoon-collection',
    category: 'fashion',
    year: 2026,
    location: "Rangpur, Bangladesh",
    client: 'Aranya Studio',
    description:
      'A seasonal lookbook shot on location during the first monsoon rains, leaning into texture, movement and natural light rather than a controlled set.',
    featured: true,
    frames: 4,
     images: ['pexels-upenderphotography-37602134','img3','img6_2','img1','img38','shopkundusa-woman-7633843_1920'],
  },
  {
    title: 'Product Launch — Anthem',
    slug: 'product-launch-anthem',
    category: 'commercial',
    year: 2025,
    location: 'Dhaka, Bangladesh',
    client: 'Anthem Goods',
    description:
      'Brand photography and a 60-second film for a product launch, built around clean studio setups and a restrained, tactile palette.',
    featured: false,
    frames: 5,
     images: ['pexels-upenderphotography-37602134','image3','image6_2','img1'],
  },
  {
    title: 'Conference — Horizon Summit',
    slug: 'conference-horizon-summit',
    category: 'events',
    year: 2025,
    location: 'Dhaka, Bangladesh',
    client: 'Horizon Summit',
    description:
      'Two-day coverage of a technology summit — keynotes, candid delegate moments, and a same-day highlight edit delivered before doors closed.',
    featured: false,
    frames: 4,
    images: ['pexels-upenderphotography-37602134'],
  },
  {
    title: 'Travel — Largest Sea Beach',
    slug: 'travel-northern-hill-tracts',
    category: 'travel',
    year: 2024,
    location: 'Cox\'s Bazar, Bangladesh',
    description:
      'A personal project documenting a week travelling through the hill tracts — landscapes, portraits of the communities met along the way, and the long drives between them.',
    featured: true,
    frames: 4,
     images: ['tarikul-raana-HwSXA03WH8o-unsplash','img_51','md-emam-hossain-ripon-ZIOw-4LHIGY-unsplash','kamrul-hussain-aSt2n5Oyp0k-unsplash','ashraful-haque-akash-5QTAbs-MBfE-unsplash',],
  },
  {
    title: 'Wedding — Pirgachha, Rangpur',
    slug: 'wedding-Pirgachha, Rangpur',
    category: 'wedding',
    year: 2025,
    location: 'Rangpur, Bangladesh',
    client: 'Richi & Riyad',
    description:
      'An outdoor tea-garden ceremony shot at golden hour, with an emphasis on the surrounding landscape as much as the couple.',
    featured: true,
    frames: 6,
    images: ['img18','img14','img17','img15','img4','img6'],
  },
  {
    title: 'Portrait — The Makers',
    slug: 'portrait-the-makers',
    category: 'portrait',
    year: 2024,
    location: 'Dhaka, Bangladesh',
    client: 'Personal project',
    description:
      'An ongoing series of environmental portraits of independent craftspeople, photographed in their own workshops.',
    featured: false,
    frames: 4,
  },
  {
    title: 'Commercial — Coastal Hospitality',
    slug: 'commercial-coastal-hospitality',
    category: 'commercial',
    year: 2026,
    location: "Cox's Bazar, Bangladesh",
    client: 'Shoreline Resorts',
    description:
      'A two-day shoot covering property, food and guest-experience photography for a resort relaunch campaign.',
    featured: false,
    frames: 5,
  },
];

export const projects: Project[] = seeds.map((seed, index) => {
  const tone = categoryTones[seed.category] ?? ['#161410', '#B08D57'];
  const placeholderCover = duotonePlate(
    seed.slug,
    tone,
    seed.title.split(' — ')[0] ?? seed.title,
    seed.category,
  );
  const realImages = isCloudinaryConfigured ? (seed.images ?? []) : [];
  const frameCount = Math.max(seed.frames, realImages.length);

  return {
    id: String(index + 1),
    title: seed.title,
    slug: seed.slug,
    category: seed.category,
    description: seed.description,
    year: seed.year,
    location: seed.location,
    client: seed.client,
    cover_image: realImages[0]
      ? cldImage(realImages[0], { width: 1600, height: 2000, crop: 'fill', gravity: 'auto' })
      : placeholderCover,
    cover_tone: tone,
    featured: seed.featured,
    published: true,
    media: Array.from({ length: frameCount }).map((_, i) => ({
      id: `${seed.slug}-${i}`,
      project_id: String(index + 1),
      type: 'image' as const,
      media_url: realImages[i]
        ? cldImage(realImages[i], { width: 1400, height: 1750, crop: 'fill', gravity: 'auto' })
        : duotonePlate(`${seed.slug}-${i}`, tone, `${String(i + 1).padStart(2, '0')}`, ''),
      thumbnail_url: null,
      alt_text: realImages[i] ? `${seed.title} — photo ${i + 1}` : `${seed.title} — frame ${i + 1}`,
      sort_order: i,
    })),
  };
});

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured && p.published);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'all') return projects.filter((p) => p.published);
  return projects.filter((p) => p.category === category && p.published);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const list = projects.filter((p) => p.published);
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1) return { previous: null, next: null };
  const previous = index === 0 ? list[list.length - 1] : list[index - 1];
  const next = index === list.length - 1 ? list[0] : list[index + 1];
  return { previous: previous ?? null, next: next ?? null };
}
