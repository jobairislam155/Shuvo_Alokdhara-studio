import { Service } from '@/types';
import { duotonePlate } from './placeholder-art';
import { cldImage, isCloudinaryConfigured } from '@/lib/cloudinary';

interface Seed {
  title: string;
  slug: string;
  description: string;
  deliverables: string[];
  tone: [string, string];
  price: string;
  badge?: string;
  note: string;
  /**
   * Your real Cloudinary photo for this package, as its public ID
   * (Media Library → click the photo → copy Public ID). Leave empty
   * to keep the placeholder gradient.
   * Example: photo: 'img30'
   */
  photo?: string;
}

const seeds: Seed[] = [
  {
    title: 'Engagement / Pre-Wedding Package',
    slug: 'engagement-pre-wedding-package',
    price: 'BDT 8,000.00',
    photo: 'img70',
    description: '💍 Romantic Couple Session',
    deliverables: [
      '👤 1 Photographer',
      '🎥 1 Cinematographer (Optional)',
      '📸 40+ Edited Cinematic Photos',
      '🎬 1 Minute Highlight Reel',
      '📍 Outdoor / Indoor Locations',
    ],
    note: 'Share your preferred date & location to book your session.',
    tone: ['#221820', '#a8657a'],
  },
  {
    title: 'Wedding Photo Basic Package',
    slug: 'wedding-photo-basic-package',
    price: 'BDT 5,000.00',
    photo: 'img71',
    description: '✨ Complete Wedding Day Coverage',
    deliverables: [
      '👤 1 Professional Photographer',
      '🤝 1 Assistant',
      '📸 Unlimited RAW Photos',
      '🎨 150+ Professionally Edited Photos',
      '🎬 1 Highlight Trailer (Short Video)',
      '💾 Delivery via Google Drive',
    ],
    note: 'Share your event date & venue for final quotation.',
    tone: ['#1c1f22', '#8a97a3'],
  },
  {
    title: 'Wedding Photo + Video Basic Package',
    slug: 'wedding-photo-video-basic-package',
    price: 'BDT 10,000.00',
    photo: 'img72',
    description: '✨ Premium Coverage',
    deliverables: [
      '👤 1 Photographer',
      '🎥 1 Cinematographer',
      '🤝 1 Assistant',
      '📸 Unlimited RAW Photos',
      '🎨 200+ Edited Photos',
      '🎬 1 Highlight Trailer + 1 Full Movie (Basic Video)',
      '💾 Google Drive Delivery',
    ],
    note: 'Book your date now.',
    tone: ['#241d15', '#c9a15a'],
  },
  {
    title: 'Wedding Premium Package',
    slug: 'wedding-premium-package',
    price: 'BDT 12,000.00',
    photo: 'img73_1',
    description: '✨ Premium Wedding Experience',
    deliverables: [
      '👤 2 Photographers',
      '🎥 1 Cinematographer',
      '🤝 1 Assistant',
      '📸 Unlimited RAW Photos',
      '🎨 250+ Edited Photos',
      '🎬 2 Cinematic Trailers',
      '🎞️ 1 Full Wedding Movie',
      '💾 Pendrive + Google Drive Delivery',
    ],
    note: 'Share your wedding date & venue for booking confirmation.',
    tone: ['#2b241c', '#c9a15a'],
  },
  {
    title: 'Wedding Luxury Package',
    slug: 'wedding-luxury-package',
    price: 'BDT 15,000.00',
    badge: 'Drone Included',
    photo: 'img74',
    description: '✨ Luxury Cinematic Wedding Coverage',
    deliverables: [
      '👤 2 Photographers',
      '🎥 1 Cinematographer',
      '🤝 1 Assistant',
      '🚁 Drone Coverage',
      '📸 Unlimited RAW Photos',
      '🎨 300+ Edited Premium Photos',
      '🎬 3 Cinematic Trailers',
      '🎞️ 1 Full Wedding Film',
      '📖 Premium 12x36 Album',
      '💾 Custom Pendrive Box + Google Drive Backup',
    ],
    note: 'Limited bookings available. Secure your date today.',
    tone: ['#12181a', '#c98a3a'],
  },
  {
    title: 'Travel Photography Package',
    slug: 'travel-photography-package',
    price: 'BDT 8,000.00',
    photo: 'img75',
    description: '🌍 Destination & Travel Storytelling',
    deliverables: [
      '👤 2 Photographers',
      '🎥 1 Cinematographer',
      '🚁 Drone Coverage',
      '✈️ Multi-Day / Multi-Location Coverage',
      '📸 Unlimited RAW Photos',
      '🎨 400+ Edited Photos',
      '🎬 1 Cinematic Travel Film + 3 Social Reels',
      '💾 Google Drive Delivery',
    ],
    note: 'Share your destination & travel dates for a tailored plan.',
    tone: ['#12181a', '#5fa3a0'],
  },
  {
    title: 'Fashion Photography Package',
    slug: 'fashion-photography-package',
    price: 'BDT 8,000.00',
    photo: 'img80',
    description: '👗 Editorial Fashion Shoot',
    deliverables: [
      '👤 2 Photographer',
      '🎨 Creative Direction & Styling Guidance',
      '📍 Studio / Outdoor Location',
      '📸 Unlimited RAW Photos',
      '✨ 30+ Retouched Photos',
      '🎬 1 Behind-the-Scenes Reel',
      '💾 Google Drive Delivery',
    ],
    note: 'Share your concept, date & location to book your shoot.',
    tone: ['#1c1820', '#b58a9e'],
  },
  {
    title: 'Product Launch Package',
    slug: 'product-launch-package',
    price: 'BDT 8,000.00',
    photo: 'img79',
    description: '🚀 Product Launch Coverage',
    deliverables: [
      '👤 2 Photographer',
      '🎥 1 Cinematographer (Optional)',
      '📍 Studio / On-site Location',
      '📸 25+ Edited Product Photos',
      '🎬 1 Launch Teaser Reel (30–60 sec)',
      '💾 Google Drive Delivery',
    ],
    note: 'Share your product & launch date for booking confirmation.',
    tone: ['#161a1d', '#d1a24a'],
  },
];

export const services: Service[] = seeds.map((seed, index) => ({
  id: String(index + 1),
  title: seed.title,
  slug: seed.slug,
  description: seed.description,
  deliverables: seed.deliverables,
  image:
    seed.photo && isCloudinaryConfigured
      ? cldImage(seed.photo, { width: 900, height: 675 })
      : duotonePlate(seed.slug, seed.tone, seed.title),
  cover_tone: seed.tone,
  price: seed.price,
  badge: seed.badge,
  note: seed.note,
  published: true,
}));

export function getPublishedServices(): Service[] {
  return services.filter((s) => s.published);
}