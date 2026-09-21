import { isSupabaseConfigured } from './client';
import { createServerSupabaseClient } from './server';
import type { FilmReel, Inquiry, Project, Service, Testimonial } from '@/types';
import * as demoProjects from '@/lib/data/projects';
import * as demoServices from '@/lib/data/services';
import * as demoTestimonials from '@/lib/data/testimonials';
import { reels as demoReels } from '@/lib/data/reels';
import { cldVideo, cldVideoPoster } from '@/lib/cloudinary';
import { projectsToSlides, type SlidePhoto } from '@/lib/utils/slideshow';

/**
 * Every function here prefers live Supabase data and transparently falls
 * back to the bundled demo content (lib/data/*) when Supabase credentials
 * are not present, or when a query errors — per spec §33. Production sites
 * should configure Supabase so these fallbacks are never hit.
 */

export async function fetchFeaturedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return demoProjects.getFeaturedProjects();
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_media(*)')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return demoProjects.getFeaturedProjects();
    return data as unknown as Project[];
  } catch {
    return demoProjects.getFeaturedProjects();
  }
}

export async function fetchProjectsByCategory(category: string): Promise<Project[]> {
  if (!isSupabaseConfigured) return demoProjects.getProjectsByCategory(category);
  try {
    const supabase = createServerSupabaseClient();
    let query = supabase.from('projects').select('*, project_media(*)').eq('published', true);
    if (category !== 'all') query = query.eq('category', category);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error || !data) return demoProjects.getProjectsByCategory(category);
    return data as unknown as Project[];
  } catch {
    return demoProjects.getProjectsByCategory(category);
  }
}

/** Every photo from the Photography section, ready for the slideshows. */
export async function fetchSlideshowPhotos(): Promise<SlidePhoto[]> {
  const projects = await fetchProjectsByCategory('all');
  return projectsToSlides(projects);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!isSupabaseConfigured) return demoProjects.getProjectBySlug(slug);
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_media(*)')
      .eq('slug', slug)
      .single();
    if (error || !data) return demoProjects.getProjectBySlug(slug);
    return data as unknown as Project;
  } catch {
    return demoProjects.getProjectBySlug(slug);
  }
}

export async function fetchAdjacentProjects(slug: string) {
  if (!isSupabaseConfigured) return demoProjects.getAdjacentProjects(slug);
  // A production implementation would query ordered slugs either side of
  // the current one; the demo fallback covers local development.
  return demoProjects.getAdjacentProjects(slug);
}

export async function fetchServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) return demoServices.getPublishedServices();
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return demoServices.getPublishedServices();
    return data as unknown as Service[];
  } catch {
    return demoServices.getPublishedServices();
  }
}

/**
 * Videography page films. Videos added in the admin dashboard win; until the
 * first one exists, the bundled sample films are shown.
 */
export async function fetchReels(): Promise<FilmReel[]> {
  if (!isSupabaseConfigured) return demoReels;
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('reels')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return demoReels;
    return data.map((row) => ({
      id: String(row.id),
      title: row.title,
      category: row.category,
      year: row.year,
      video_url: cldVideo(row.video_url),
      // Auto poster frame for Cloudinary public IDs; other URLs use the styled placeholder.
      poster_url: /^https?:/.test(row.video_url) ? undefined : cldVideoPoster(row.video_url),
      showreel: Boolean(row.showreel),
    }));
  } catch {
    return demoReels;
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return demoTestimonials.getPublishedTestimonials();
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from('testimonials').select('*').eq('published', true);
    if (error || !data || data.length === 0) return demoTestimonials.getPublishedTestimonials();
    return data as unknown as Testimonial[];
  } catch {
    return demoTestimonials.getPublishedTestimonials();
  }
}

export async function submitInquiry(
  payload: Omit<Inquiry, 'id' | 'status' | 'created_at'>,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    // Demo mode: log server-side only, so local development still shows a
    // realistic success state without a database attached.
    console.info('[demo mode] inquiry received (not persisted):', payload);
    return { ok: true };
  }
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from('inquiries').insert({ ...payload, status: 'new' });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
