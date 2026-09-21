'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from './admin-auth';
import { getPublishedServices } from '@/lib/data/services';
import { duotonePlate } from '@/lib/data/placeholder-art';

// Every action below starts with `adminClient()`, which refuses anyone who is
// not the registered admin — server actions are public POST endpoints, so the
// check has to live here and not only in the pages.

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();
const optional = (fd: FormData, key: string) => text(fd, key) || null;
const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

function must(result: { error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
}

/** Refresh the public pages too, so edits show up on the live site at once. */
function refresh(adminPath?: string) {
  revalidatePath('/', 'layout');
  if (adminPath) revalidatePath(adminPath);
}

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------

export async function createProject(formData: FormData) {
  const supabase = await adminClient();
  const title = text(formData, 'title');

  must(
    await supabase.from('projects').insert({
      title,
      slug: slugify(title),
      category: text(formData, 'category') || 'wedding',
      description: text(formData, 'description'),
      year: Number(formData.get('year') ?? new Date().getFullYear()),
      location: text(formData, 'location'),
      client: optional(formData, 'client'),
      cover_image: text(formData, 'cover_image'),
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
    }),
  );
  refresh('/admin/dashboard/projects');
}

export async function updateProject(formData: FormData) {
  const supabase = await adminClient();
  const update: Record<string, unknown> = {
    title: text(formData, 'title'),
    category: text(formData, 'category') || 'wedding',
    description: text(formData, 'description'),
    year: Number(formData.get('year') ?? new Date().getFullYear()),
    location: text(formData, 'location'),
    client: optional(formData, 'client'),
  };
  const cover = text(formData, 'cover_image');
  if (cover) update.cover_image = cover; // empty = keep the current photo
  must(await supabase.from('projects').update(update).eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/projects');
}

export async function deleteProject(formData: FormData) {
  const supabase = await adminClient();
  must(await supabase.from('projects').delete().eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/projects');
}

export async function toggleProjectField(formData: FormData) {
  const supabase = await adminClient();
  const field = text(formData, 'field');
  if (field !== 'published' && field !== 'featured') return;
  const current = formData.get('current') === 'true';
  must(
    await supabase
      .from('projects')
      .update({ [field]: !current })
      .eq('id', text(formData, 'id')),
  );
  refresh('/admin/dashboard/projects');
}

// ---------------------------------------------------------------------
// Project media (photos + videos)
// ---------------------------------------------------------------------

export async function createMedia(formData: FormData) {
  const supabase = await adminClient();
  must(
    await supabase.from('project_media').insert({
      project_id: text(formData, 'project_id'),
      type: text(formData, 'type') === 'video' ? 'video' : 'image',
      media_url: text(formData, 'media_url'),
      alt_text: text(formData, 'alt_text'),
      sort_order: Number(formData.get('sort_order') ?? 0),
    }),
  );
  refresh('/admin/dashboard/media');
}

export async function deleteMedia(formData: FormData) {
  const supabase = await adminClient();
  must(await supabase.from('project_media').delete().eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/media');
}

// ---------------------------------------------------------------------
// Videos (the Videography page)
// ---------------------------------------------------------------------

const REEL_CATEGORIES = ['wedding', 'commercial', 'short', 'event', 'social'];

async function clearOtherShowreels(supabase: Awaited<ReturnType<typeof adminClient>>, keepId: string) {
  must(await supabase.from('reels').update({ showreel: false }).neq('id', keepId));
}

export async function createReel(formData: FormData) {
  const supabase = await adminClient();
  const category = text(formData, 'category');
  const showreel = formData.get('showreel') === 'on';
  const { data, error } = await supabase
    .from('reels')
    .insert({
      title: text(formData, 'title'),
      category: REEL_CATEGORIES.includes(category) ? category : 'wedding',
      year: Number(formData.get('year') ?? new Date().getFullYear()),
      video_url: text(formData, 'video_url'),
      sort_order: Number(formData.get('sort_order') ?? 0),
      showreel,
      published: formData.get('published') === 'on',
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  if (showreel && data) await clearOtherShowreels(supabase, data.id);
  refresh('/admin/dashboard/videos');
}

export async function updateReel(formData: FormData) {
  const supabase = await adminClient();
  const id = text(formData, 'id');
  const category = text(formData, 'category');
  const showreel = formData.get('showreel') === 'on';
  const update: Record<string, unknown> = {
    title: text(formData, 'title'),
    category: REEL_CATEGORIES.includes(category) ? category : 'wedding',
    year: Number(formData.get('year') ?? new Date().getFullYear()),
    sort_order: Number(formData.get('sort_order') ?? 0),
    showreel,
  };
  const video = text(formData, 'video_url');
  if (video) update.video_url = video; // empty = keep the current video
  must(await supabase.from('reels').update(update).eq('id', id));
  if (showreel) await clearOtherShowreels(supabase, id);
  refresh('/admin/dashboard/videos');
}

export async function deleteReel(formData: FormData) {
  const supabase = await adminClient();
  must(await supabase.from('reels').delete().eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/videos');
}

export async function toggleReelPublished(formData: FormData) {
  const supabase = await adminClient();
  const current = formData.get('current') === 'true';
  must(await supabase.from('reels').update({ published: !current }).eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/videos');
}

// ---------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------

export async function createService(formData: FormData) {
  const supabase = await adminClient();
  const title = text(formData, 'title');
  const slug = slugify(title);

  must(
    await supabase.from('services').insert({
      title,
      slug,
      description: text(formData, 'description'),
      deliverables: lines(text(formData, 'deliverables')),
      // No photo chosen → generated placeholder plate, never a blank image.
      image: text(formData, 'image') || duotonePlate(slug, ['#161410', '#B08D57'], title),
      price: optional(formData, 'price'),
      badge: optional(formData, 'badge'),
      note: optional(formData, 'note'),
      sort_order: Number(formData.get('sort_order') ?? 0),
      published: formData.get('published') === 'on',
    }),
  );
  refresh('/admin/dashboard/services');
}

export async function updateService(formData: FormData) {
  const supabase = await adminClient();
  const update: Record<string, unknown> = {
    title: text(formData, 'title'),
    description: text(formData, 'description'),
    deliverables: lines(text(formData, 'deliverables')),
    price: optional(formData, 'price'),
    badge: optional(formData, 'badge'),
    note: optional(formData, 'note'),
    sort_order: Number(formData.get('sort_order') ?? 0),
    published: formData.get('published') === 'on',
  };
  const image = text(formData, 'image');
  if (image) update.image = image; // empty = keep the current photo
  must(await supabase.from('services').update(update).eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/services');
}

export async function deleteService(formData: FormData) {
  const supabase = await adminClient();
  must(await supabase.from('services').delete().eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/services');
}

export async function toggleServicePublished(formData: FormData) {
  const supabase = await adminClient();
  const current = formData.get('current') === 'true';
  must(await supabase.from('services').update({ published: !current }).eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/services');
}

/** One-click: copy the built-in wedding packages into an empty services table. */
export async function importDefaultServices() {
  const supabase = await adminClient();
  const { count } = await supabase.from('services').select('*', { count: 'exact', head: true });
  if (count) return;
  must(
    await supabase.from('services').insert(
      getPublishedServices().map((s, i) => ({
        title: s.title,
        slug: s.slug,
        description: s.description,
        deliverables: s.deliverables,
        image: s.image,
        price: s.price ?? null,
        badge: s.badge ?? null,
        note: s.note ?? null,
        sort_order: i,
        published: true,
      })),
    ),
  );
  refresh('/admin/dashboard/services');
}

// ---------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------

export async function createTestimonial(formData: FormData) {
  const supabase = await adminClient();
  must(
    await supabase.from('testimonials').insert({
      client_name: text(formData, 'client_name'),
      project_type: text(formData, 'project_type'),
      testimonial: text(formData, 'testimonial'),
      published: formData.get('published') === 'on',
    }),
  );
  refresh('/admin/dashboard/testimonials');
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await adminClient();
  must(await supabase.from('testimonials').delete().eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/testimonials');
}

export async function toggleTestimonialPublished(formData: FormData) {
  const supabase = await adminClient();
  const current = formData.get('current') === 'true';
  must(await supabase.from('testimonials').update({ published: !current }).eq('id', text(formData, 'id')));
  refresh('/admin/dashboard/testimonials');
}

// ---------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------

export async function updateInquiryStatus(formData: FormData) {
  const supabase = await adminClient();
  must(await supabase.from('inquiries').update({ status: text(formData, 'status') }).eq('id', text(formData, 'id')));
  revalidatePath('/admin/dashboard/inquiries');
}

export async function deleteInquiry(formData: FormData) {
  const supabase = await adminClient();
  must(await supabase.from('inquiries').delete().eq('id', text(formData, 'id')));
  revalidatePath('/admin/dashboard/inquiries');
}
