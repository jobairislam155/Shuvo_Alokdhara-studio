'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Signing in is not enough — the account must be the registered admin.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: adminRow, error: adminError } = user
      ? await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
      : { data: null, error: null };
    if (adminError || !adminRow) {
      await supabase.auth.signOut();
      setLoading(false);
      setError(
        adminError
          ? 'Could not verify admin access. Make sure supabase/schema.sql has been run.'
          : 'This account does not have admin access.',
      );
      return;
    }

    setLoading(false);
    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <label className="mb-2 block font-sans text-xs uppercase tracking-widest text-ink-200">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-ink-300 bg-transparent py-2.5 font-sans text-base text-ink-50 outline-none focus:border-brass md:text-sm"
        />
      </div>
      <div>
        <label className="mb-2 block font-sans text-xs uppercase tracking-widest text-ink-200">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b border-ink-300 bg-transparent py-2.5 font-sans text-base text-ink-50 outline-none focus:border-brass md:text-sm"
        />
      </div>
      {error ? <p className="font-sans text-sm text-danger">{error}</p> : null}
      <Button type="submit" variant="solid" disabled={loading} className="w-full">
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  );
}
