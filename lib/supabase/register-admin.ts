'use server';

import { createHash, timingSafeEqual } from 'crypto';
import { createServiceRoleClient, isSupabaseConfigured } from './server';

export type RegisterResult = { ok: true } | { ok: false; error: string };

const sha = (value: string) => createHash('sha256').update(value).digest();

/**
 * One-time admin registration.
 *
 * Guards, in order:
 *  1. The caller must know ADMIN_SETUP_CODE (a secret set on the server).
 *  2. Registration only works while NO admin exists — once the studio owner
 *     has registered, this endpoint refuses everyone, including the owner.
 * The account is created with the service-role key, so public sign-ups can
 * (and should) be switched off in Supabase → Authentication.
 */
export async function registerAdmin(formData: FormData): Promise<RegisterResult> {
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: 'Supabase is not fully configured on the server.' };
  }
  const setupCode = process.env.ADMIN_SETUP_CODE;
  if (!setupCode || setupCode.length < 8) {
    return {
      ok: false,
      error: 'Registration is disabled. Set ADMIN_SETUP_CODE (8+ characters) in the server environment first.',
    };
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  const code = String(formData.get('code') ?? '');

  if (!timingSafeEqual(sha(code), sha(setupCode))) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    return { ok: false, error: 'Invalid setup code.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Enter a valid email address.' };
  if (password.length < 10) return { ok: false, error: 'Password must be at least 10 characters.' };
  if (password !== confirm) return { ok: false, error: 'Passwords do not match.' };

  const service = createServiceRoleClient();

  const { count, error: countError } = await service.from('admins').select('*', { count: 'exact', head: true });
  if (countError) {
    return { ok: false, error: 'Could not check admin status. Have you run supabase/schema.sql?' };
  }
  if ((count ?? 0) > 0) {
    return { ok: false, error: 'An admin account already exists. Registration is closed — please sign in.' };
  }

  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !created.user) {
    return { ok: false, error: createError?.message ?? 'Could not create the account.' };
  }

  const { error: insertError } = await service.from('admins').insert({ user_id: created.user.id, email });
  if (insertError) {
    await service.auth.admin.deleteUser(created.user.id);
    return { ok: false, error: 'Could not register the admin. ' + insertError.message };
  }

  return { ok: true };
}
