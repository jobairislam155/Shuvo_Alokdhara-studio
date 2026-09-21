import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createReel, deleteReel, toggleReelPublished, updateReel } from '@/lib/supabase/admin-actions';
import { UploadField } from '@/components/admin/UploadField';

const categories = [
  { value: 'wedding', label: 'Wedding Films' },
  { value: 'commercial', label: 'Commercial Films' },
  { value: 'short', label: 'Short Films' },
  { value: 'event', label: 'Event Films' },
  { value: 'social', label: 'Social Reels' },
];

type Reel = {
  id: string;
  title: string;
  category: string;
  year: number;
  video_url: string;
  sort_order: number;
  showreel: boolean;
  published: boolean;
};

function ReelFields({ reel }: { reel?: Reel }) {
  return (
    <>
      <input name="title" required placeholder="Video title" defaultValue={reel?.title} className="admin-input" />
      <select name="category" defaultValue={reel?.category ?? 'wedding'} className="admin-input">
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        name="year"
        type="number"
        placeholder="Year"
        defaultValue={reel?.year ?? new Date().getFullYear()}
        className="admin-input"
      />
      <input name="sort_order" type="number" placeholder="Order (0 = first)" defaultValue={reel?.sort_order ?? 0} className="admin-input" />
      <UploadField
        name="video_url"
        resourceType="video"
        required={!reel}
        label={reel ? 'Change video (leave empty to keep the current one)' : 'Video'}
        placeholder="Upload a video, or paste a Cloudinary public ID / video URL"
      />
      <label className="flex items-center gap-2 font-sans text-sm text-ink-100 md:col-span-2">
        <input type="checkbox" name="showreel" defaultChecked={reel?.showreel} /> Use as the Showreel at the top of the Videography page
      </label>
    </>
  );
}

export default async function AdminVideosPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  const reels = (data ?? []) as Reel[];

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl text-ink-50">Videos</h1>
      <p className="mb-8 max-w-xl font-sans text-sm text-ink-100">
        Films shown on the Videography page. Until you add your first video here, the site shows its built-in
        sample films.
      </p>

      {error ? (
        <p className="mb-8 font-sans text-sm text-danger">
          Could not load videos. Re-run <code>supabase/schema.sql</code> to create the videos table.
        </p>
      ) : null}

      <details className="mb-12 border border-ink-400" open={!reels.length}>
        <summary className="cursor-pointer p-6 font-sans text-xs uppercase tracking-widest text-brass">
          + Add a video
        </summary>
        <form action={createReel} className="grid grid-cols-1 gap-4 border-t border-ink-400 p-6 md:grid-cols-2">
          <ReelFields />
          <div className="flex items-center gap-6 md:col-span-2">
            <label className="flex items-center gap-2 font-sans text-sm text-ink-100">
              <input type="checkbox" name="published" defaultChecked /> Published
            </label>
            <button
              type="submit"
              className="ml-auto border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass"
            >
              Add Video
            </button>
          </div>
        </form>
      </details>

      <div className="divide-y divide-ink-400 border-t border-ink-400">
        {reels.map((r) => (
          <div key={r.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-serif text-lg text-ink-50">{r.title}</p>
                <p className="font-sans text-xs uppercase tracking-widest text-ink-200">
                  {r.category} · {r.year} · {r.published ? 'Published' : 'Draft'}
                  {r.showreel ? ' · Showreel' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form action={toggleReelPublished}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="current" value={String(r.published)} />
                  <button className="font-sans text-xs uppercase tracking-widest text-ink-100 hover:text-brass">
                    {r.published ? 'Unpublish' : 'Publish'}
                  </button>
                </form>
                <form action={deleteReel}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="font-sans text-xs uppercase tracking-widest text-danger hover:text-danger-hover">
                    Delete
                  </button>
                </form>
              </div>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer font-sans text-xs uppercase tracking-widest text-brass">Edit</summary>
              <form action={updateReel} className="mt-4 grid grid-cols-1 gap-4 border border-ink-400 p-6 md:grid-cols-2">
                <input type="hidden" name="id" value={r.id} />
                <ReelFields reel={r} />
                <button
                  type="submit"
                  className="w-fit border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass md:col-span-2"
                >
                  Save Changes
                </button>
              </form>
            </details>
          </div>
        ))}
        {!reels.length && !error && (
          <p className="py-6 font-sans text-sm text-ink-200">No videos yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}
