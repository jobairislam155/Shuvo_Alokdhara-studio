import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createMedia, deleteMedia } from '@/lib/supabase/admin-actions';
import { UploadField } from '@/components/admin/UploadField';

export default async function AdminMediaPage() {
  const supabase = createServerSupabaseClient();
  const [{ data: projects }, { data: media }] = await Promise.all([
    supabase.from('projects').select('id, title').order('title'),
    supabase
      .from('project_media')
      .select('*, projects(title)')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-ink-50">Media</h1>

      <form action={createMedia} className="mb-12 grid grid-cols-1 gap-4 border border-ink-400 p-6 md:grid-cols-2">
        <select name="project_id" required className="admin-input">
          <option value="">Select project…</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <UploadField name="media_url" typeName="type" resourceType="auto" required label="Photo or video" />
        <input name="alt_text" placeholder="Alt text" className="admin-input" />
        <input name="sort_order" type="number" placeholder="Sort order" className="admin-input" defaultValue={0} />
        <button
          type="submit"
          className="border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass md:col-span-2 md:w-fit"
        >
          Add Media
        </button>
      </form>

      <div className="divide-y divide-ink-400 border-t border-ink-400">
        {media?.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="font-serif text-ink-50">
                {(m as any).projects?.title ?? 'Untitled project'} — {m.type}
              </p>
              <p className="max-w-md truncate font-sans text-xs text-ink-200">{m.media_url}</p>
            </div>
            <form action={deleteMedia}>
              <input type="hidden" name="id" value={m.id} />
              <button className="font-sans text-xs uppercase tracking-widest text-danger hover:text-danger-hover">
                Delete
              </button>
            </form>
          </div>
        ))}
        {!media?.length && (
          <p className="py-6 font-sans text-sm text-ink-200">No media yet — add some above.</p>
        )}
      </div>
    </div>
  );
}
