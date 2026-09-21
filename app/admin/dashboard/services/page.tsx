import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createService,
  deleteService,
  importDefaultServices,
  toggleServicePublished,
  updateService,
} from '@/lib/supabase/admin-actions';
import { ServiceFields } from '@/components/admin/ServiceFields';
import type { Service } from '@/types';

export default async function AdminServicesPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at');
  const services = (data ?? []) as Service[];

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-ink-50">Services</h1>

      {services.length === 0 && (
        <form action={importDefaultServices} className="mb-8 border border-ink-400 p-6">
          <p className="max-w-xl font-sans text-sm leading-relaxed text-ink-100">
            Your services table is empty, so the website is showing the built-in wedding packages. Import them
            once to edit prices, photos and details from here.
          </p>
          <button
            type="submit"
            className="mt-4 border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass"
          >
            Import the current packages
          </button>
        </form>
      )}

      <details className="mb-12 border border-ink-400">
        <summary className="cursor-pointer p-6 font-sans text-xs uppercase tracking-widest text-brass">
          + Add a package
        </summary>
        <form action={createService} className="grid grid-cols-1 gap-4 border-t border-ink-400 p-6 md:grid-cols-2">
          <ServiceFields />
          <div className="flex items-center gap-6 md:col-span-2">
            <label className="flex items-center gap-2 font-sans text-sm text-ink-100">
              <input type="checkbox" name="published" defaultChecked /> Published
            </label>
            <button
              type="submit"
              className="ml-auto border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass"
            >
              Add Service
            </button>
          </div>
        </form>
      </details>

      <div className="divide-y divide-ink-400 border-t border-ink-400">
        {services.map((s) => (
          <div key={s.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-serif text-lg text-ink-50">{s.title}</p>
                <p className="font-sans text-xs uppercase tracking-widest text-ink-200">
                  {s.price ? `${s.price} · ` : ''}
                  {s.published ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form action={toggleServicePublished}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="current" value={String(s.published)} />
                  <button className="font-sans text-xs uppercase tracking-widest text-ink-100 hover:text-brass">
                    {s.published ? 'Unpublish' : 'Publish'}
                  </button>
                </form>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="font-sans text-xs uppercase tracking-widest text-danger hover:text-danger-hover">
                    Delete
                  </button>
                </form>
              </div>
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer font-sans text-xs uppercase tracking-widest text-brass">Edit</summary>
              <form action={updateService} className="mt-4 grid grid-cols-1 gap-4 border border-ink-400 p-6 md:grid-cols-2">
                <input type="hidden" name="id" value={s.id} />
                <ServiceFields service={s} />
                <div className="flex items-center gap-6 md:col-span-2">
                  <label className="flex items-center gap-2 font-sans text-sm text-ink-100">
                    <input type="checkbox" name="published" defaultChecked={s.published} /> Published
                  </label>
                  <button
                    type="submit"
                    className="ml-auto border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </details>
          </div>
        ))}
        {!services.length && (
          <p className="py-6 font-sans text-sm text-ink-200">No services yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}
