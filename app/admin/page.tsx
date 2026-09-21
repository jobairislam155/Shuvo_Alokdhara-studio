import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminIndexPage() {
  const admin = await getAdminUser();
  redirect(admin ? '/admin/dashboard' : '/admin/login');
}
