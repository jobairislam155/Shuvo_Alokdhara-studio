'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { registerAdmin } from '@/lib/supabase/register-admin';
import { Button } from '@/components/ui/Button';

const inputClass =
  'w-full border-b border-ink-300 bg-transparent py-2.5 font-sans text-base text-ink-50 outline-none focus:border-brass md:text-sm';
const labelClass = 'mb-2 block font-sans text-xs uppercase tracking-widest text-ink-200';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const result = await registerAdmin(form);
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }

    // Account created — sign straight in.
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get('email') ?? '').trim().toLowerCase(),
      password: String(form.get('password') ?? ''),
    });
    setLoading(false);
    if (signInError) {
      router.push('/admin/login');
      return;
    }
    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <label className={labelClass}>Email</label>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Password (10+ characters)</label>
        <input name="password" type="password" required minLength={10} autoComplete="new-password" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Confirm password</label>
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Setup code</label>
        <input name="code" type="password" required autoComplete="off" className={inputClass} />
      </div>
      {error ? <p className="font-sans text-sm text-danger">{error}</p> : null}
      <Button type="submit" variant="solid" disabled={loading} className="w-full">
        {loading ? 'Creating account…' : 'Create Admin Account'}
      </Button>
    </form>
  );
}
