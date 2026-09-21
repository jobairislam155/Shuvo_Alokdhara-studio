import { redirect } from 'next/navigation';
import {
  createServerSupabaseClient,
  createServiceRoleClient,
  isSupabaseConfigured,
} from './server';

/**
 * Admin access = a signed-in Supabase user whose id is listed in the
 * `admins` table (see supabase/schema.sql). Being signed in is NOT enough —
 * this is what keeps every other Supabase account out of the dashboard.
 */
export async function getAdminUser() {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
    return data ? user : null;
  } catch {
    return null;
  }
}

/** For pages / layouts: send anyone who is not the admin to the login page. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  return user;
}

/**
 * For server actions: verifies the caller is the admin, then returns a
 * Supabase client that carries their session (so Row Level Security also
 * applies). Server actions are public POST endpoints, so every one of them
 * must go through this.
 */
export async function adminClient() {
  await requireAdmin();
  return createServerSupabaseClient();
}

/**
 * Whether an admin account already exists. Returns `null` when that cannot
 * be determined (service-role key missing, or schema not applied yet).
 */
export async function adminExists(): Promise<boolean | null> {
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const service = createServiceRoleClient();
    const { count, error } = await service.from('admins').select('*', { count: 'exact', head: true });
    if (error) return null;
    return (count ?? 0) > 0;
  } catch {
    return null;
  }
}
