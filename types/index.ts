export type MediaType = 'image' | 'video';

export type ProjectCategory =
  | 'wedding'
  | 'portrait'
  | 'fashion'
  | 'events'
  | 'commercial'
  | 'travel';

export interface ProjectMedia {
  id: string;
  project_id: string;
  type: MediaType;
  media_url: string;
  thumbnail_url: string | null;
  alt_text: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  year: number;
  location: string;
  client?: string;
  cover_image: string;
  cover_tone?: [string, string];
  featured: boolean;
  published: boolean;
  media?: ProjectMedia[];
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  deliverables: string[];
  image: string;
  cover_tone?: [string, string];
  /** Package price shown on the card, e.g. "BDT 22,000.00". */
  price?: string;
  /** Small label beside the title, e.g. "Drone Included". */
  badge?: string;
  /** Closing booking line under the deliverables. */
  note?: string;
  sort_order?: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  client_name: string;
  project_type: string;
  testimonial: string;
  image?: string;
  published: boolean;
}

export type InquiryStatus = 'new' | 'contacted' | 'booked' | 'archived';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  location: string;
  budget: string;
  service: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface FilmReel {
  id: string;
  title: string;
  category: 'wedding' | 'commercial' | 'short' | 'event' | 'social';
  video_url: string;
  poster_tone?: [string, string];
  /** Real poster frame (set for admin-uploaded videos). */
  poster_url?: string;
  /** Marked in the admin as the video shown in the Showreel section. */
  showreel?: boolean;
  year: number;
}
