import { createServerSupabaseClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/StatCard';

async function getCount(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  table: string,
  filter?: Record<string, unknown>,
) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }
  }
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminOverviewPage() {
  const supabase = createServerSupabaseClient();

  const [totalProjects, publishedProjects, totalInquiries, pendingInquiries, totalTestimonials] =
    await Promise.all([
      getCount(supabase, 'projects'),
      getCount(supabase, 'projects', { published: true }),
      getCount(supabase, 'inquiries'),
      getCount(supabase, 'inquiries', { status: 'new' }),
      getCount(supabase, 'testimonials'),
    ]);

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-ink-50">Overview</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Projects" value={totalProjects} />
        <StatCard label="Published Projects" value={publishedProjects} />
        <StatCard label="Total Inquiries" value={totalInquiries} />
        <StatCard label="Pending Inquiries" value={pendingInquiries} />
        <StatCard label="Total Testimonials" value={totalTestimonials} />
      </div>
    </div>
  );
}
