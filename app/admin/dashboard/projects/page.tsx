import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createProject, deleteProject, toggleProjectField, updateProject } from '@/lib/supabase/admin-actions';
import { UploadField } from '@/components/admin/UploadField';
import { categories } from '@/lib/config/site';

export default async function AdminProjectsPage() {
  const supabase = createServerSupabaseClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const projectCategories = categories.filter((c) => c.value !== 'all');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-ink-50">Projects</h1>

      <form action={createProject} className="mb-12 grid grid-cols-1 gap-4 border border-ink-400 p-6 md:grid-cols-2">
        <input name="title" required placeholder="Title" className="admin-input" />
        <select name="category" className="admin-input" defaultValue="wedding">
          {projectCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input name="year" type="number" placeholder="Year" className="admin-input" defaultValue={new Date().getFullYear()} />
        <input name="location" placeholder="Location" className="admin-input" />
        <input name="client" placeholder="Client (optional)" className="admin-input" />
        <UploadField name="cover_image" resourceType="image" label="Cover photo" />
        <textarea
          name="description"
          placeholder="Description"
          className="admin-input md:col-span-2 min-h-[80px]"
        />
        <div className="flex items-center gap-6 md:col-span-2">
          <label className="flex items-center gap-2 font-sans text-sm text-ink-100">
            <input type="checkbox" name="featured" /> Featured
          </label>
          <label className="flex items-center gap-2 font-sans text-sm text-ink-100">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button type="submit" className="ml-auto border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass">
            Add Project
          </button>
        </div>
      </form>

      <div className="divide-y divide-ink-400 border-t border-ink-400">
        {projects?.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="font-serif text-lg text-ink-50">{p.title}</p>
              <p className="font-sans text-xs uppercase tracking-widest text-ink-200">
                {p.category} · {p.year} · {p.published ? 'Published' : 'Draft'}
                {p.featured ? ' · Featured' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <form action={toggleProjectField}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="field" value="published" />
                <input type="hidden" name="current" value={String(p.published)} />
                <button className="font-sans text-xs uppercase tracking-widest text-ink-100 hover:text-brass">
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
              </form>
              <form action={toggleProjectField}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="field" value="featured" />
                <input type="hidden" name="current" value={String(p.featured)} />
                <button className="font-sans text-xs uppercase tracking-widest text-ink-100 hover:text-brass">
                  {p.featured ? 'Unfeature' : 'Feature'}
                </button>
              </form>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p.id} />
                <button className="font-sans text-xs uppercase tracking-widest text-danger hover:text-danger-hover">
                  Delete
                </button>
              </form>
            </div>
            <details className="w-full">
              <summary className="cursor-pointer font-sans text-xs uppercase tracking-widest text-brass">Edit</summary>
              <form action={updateProject} className="mt-4 grid grid-cols-1 gap-4 border border-ink-400 p-6 md:grid-cols-2">
                <input type="hidden" name="id" value={p.id} />
                <input name="title" required defaultValue={p.title} placeholder="Title" className="admin-input" />
                <select name="category" defaultValue={p.category} className="admin-input">
                  {projectCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input name="year" type="number" defaultValue={p.year} placeholder="Year" className="admin-input" />
                <input name="location" defaultValue={p.location} placeholder="Location" className="admin-input" />
                <input name="client" defaultValue={p.client ?? ''} placeholder="Client (optional)" className="admin-input" />
                <textarea
                  name="description"
                  defaultValue={p.description}
                  placeholder="Description"
                  className="admin-input min-h-[80px] md:col-span-2"
                />
                <UploadField
                  name="cover_image"
                  resourceType="image"
                  label="Change cover photo (leave empty to keep the current one)"
                />
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
        {!projects?.length && (
          <p className="py-6 font-sans text-sm text-ink-200">No projects yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}
