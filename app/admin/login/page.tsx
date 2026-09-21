import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { LoginForm } from '@/components/admin/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { adminExists } from '@/lib/supabase/admin-auth';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Studio Admin',
  robots: { index: false, follow: false },
};

// The "register" link depends on live data — never prerender this page.
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const canRegister = isSupabaseConfigured && (await adminExists()) === false;

  return (
    <section className="flex min-h-screen items-center bg-ink pt-20">
      <Container className="flex flex-col items-start gap-10">
        <div>
          <BrandLogo className="mb-6 h-8 w-auto" />
          <h1 className="font-serif text-display-3 text-ink-50">Studio Admin</h1>
        </div>

        {isSupabaseConfigured ? (
          <div className="space-y-6">
            <LoginForm />
            {canRegister ? (
              <p className="font-sans text-sm text-ink-100">
                First time here?{' '}
                <Link href="/admin/register" className="text-brass underline">
                  Register the admin account
                </Link>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="max-w-md border border-ink-400 p-6">
            <p className="font-sans text-sm leading-relaxed text-ink-100">
              The admin dashboard needs Supabase to be configured. Add{' '}
              <code className="text-brass">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
              <code className="text-brass">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
              <code className="text-brass">.env.local</code>, run{' '}
              <code className="text-brass">supabase/schema.sql</code> against your project, then register
              the admin account at <code className="text-brass">/admin/register</code>. See the README for
              the full walkthrough.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
