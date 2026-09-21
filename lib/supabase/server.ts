import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from './client';

export { isSupabaseConfigured };

/** Server Component / Route Handler client — reads the session from cookies. */
export function createServerSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. See .env.example.');
  }
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component with no writable cookies — safe to ignore
            // because middleware refreshes the session on the next request.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // See note above.
          }
        },
      },
    },
  );
}

/**
 * Admin-only, server-only client using the service-role key. Never import
 * this from any file that could end up in a Client Component bundle.
 */
export function createServiceRoleClient() {
  const { createClient } = require('@supabase/supabase-js');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not set.');
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
