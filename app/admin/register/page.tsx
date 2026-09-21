import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { RegisterForm } from '@/components/admin/RegisterForm';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { adminExists } from '@/lib/supabase/admin-auth';

export const metadata: Metadata = {
  title: 'Admin Registration',
  robots: { index: false, follow: false },
};

// Whether an admin exists changes at runtime — never prerender this page.
export const dynamic = 'force-dynamic';

export default async function AdminRegisterPage() {
  const exists = isSupabaseConfigured ? await adminExists() : null;
  const hasSetupCode = Boolean(process.env.ADMIN_SETUP_CODE);

  let body: React.ReactNode;
  if (!isSupabaseConfigured) {
    body = <Notice>Supabase is not configured yet. See the README for setup.</Notice>;
  } else if (exists) {
    body = (
      <Notice>
        An admin account has already been registered, so registration is closed.{' '}
        <Link href="/admin/login" className="text-brass underline">
          Sign in
        </Link>
        .
      </Notice>
    );
  } else if (exists === null) {
    body = (
      <Notice>
        Registration is not ready. Make sure <code className="text-brass">SUPABASE_SERVICE_ROLE_KEY</code> is set and{' '}
        <code className="text-brass">supabase/schema.sql</code> has been run.
      </Notice>
    );
  } else if (!hasSetupCode) {
    body = (
      <Notice>
        Set <code className="text-brass">ADMIN_SETUP_CODE</code> (a long secret of your choice) in the server
        environment, redeploy, then come back to register.
      </Notice>
    );
  } else {
    body = <RegisterForm />;
  }

  return (
    <section className="flex min-h-screen items-center bg-ink pt-20">
      <Container className="flex flex-col items-start gap-10">
        <div>
          <BrandLogo className="mb-6 h-8 w-auto" />
          <h1 className="font-serif text-display-3 text-ink-50">Admin Registration</h1>
          <p className="mt-3 max-w-md font-sans text-sm text-ink-100">
            One-time setup for the studio owner. This page closes as soon as the admin account exists.
          </p>
        </div>
        {body}
      </Container>
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-md border border-ink-400 p-6">
      <p className="font-sans text-sm leading-relaxed text-ink-100">{children}</p>
    </div>
  );
}
