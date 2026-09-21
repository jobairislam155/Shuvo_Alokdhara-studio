import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { requireAdmin } from '@/lib/supabase/admin-auth';

// These pages read the authenticated user's session via cookies on every
// request and manage live data — never statically prerendered.
export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Only the registered admin gets in; everyone else is sent to /admin/login.
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-ink pt-20 lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
