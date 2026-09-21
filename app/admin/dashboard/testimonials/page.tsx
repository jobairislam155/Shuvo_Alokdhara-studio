import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
} from '@/lib/supabase/admin-actions';

export default async function AdminTestimonialsPage() {
  const supabase = createServerSupabaseClient();
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-ink-50">Testimonials</h1>

      <form
        action={createTestimonial}
        className="mb-12 grid grid-cols-1 gap-4 border border-ink-400 p-6 md:grid-cols-2"
      >
        <input name="client_name" required placeholder="Client name" className="admin-input" />
        <input name="project_type" placeholder="Project type" className="admin-input" />
        <textarea
          name="testimonial"
          required
          placeholder="Testimonial"
          className="admin-input min-h-[80px] md:col-span-2"
        />
        <div className="flex items-center gap-6 md:col-span-2">
          <label className="flex items-center gap-2 font-sans text-sm text-ink-100">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button
            type="submit"
            className="ml-auto border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass"
          >
            Add Testimonial
          </button>
        </div>
      </form>

      <div className="divide-y divide-ink-400 border-t border-ink-400">
        {testimonials?.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="max-w-xl">
              <p className="font-serif text-ink-50">&ldquo;{t.testimonial}&rdquo;</p>
              <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink-200">
                {t.client_name} — {t.project_type} — {t.published ? 'Published' : 'Draft'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <form action={toggleTestimonialPublished}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="current" value={String(t.published)} />
                <button className="font-sans text-xs uppercase tracking-widest text-ink-100 hover:text-brass">
                  {t.published ? 'Unpublish' : 'Publish'}
                </button>
              </form>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <button className="font-sans text-xs uppercase tracking-widest text-danger hover:text-danger-hover">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {!testimonials?.length && (
          <p className="py-6 font-sans text-sm text-ink-200">No testimonials yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}
