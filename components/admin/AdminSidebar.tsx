'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GalleryHorizontalEnd,
  Image as ImageIcon,
  Film,
  Briefcase,
  Quote,
  Mail,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { createClient } from '@/lib/supabase/client';
import { BrandLogo } from '@/components/brand/BrandLogo';

const links = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/projects', label: 'Projects', icon: GalleryHorizontalEnd },
  { href: '/admin/dashboard/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/dashboard/videos', label: 'Videos', icon: Film },
  { href: '/admin/dashboard/services', label: 'Services', icon: Briefcase },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/admin/dashboard/inquiries', label: 'Inquiries', icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-ink-400 bg-ink-500 p-6 lg:w-64">
      <div>
        <BrandLogo className="mb-10 h-6 w-auto" />
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors',
                  active ? 'bg-ink-400 text-ink-50' : 'text-ink-100 hover:text-ink-50',
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={signOut}
        className="flex items-center gap-3 px-3 py-2.5 font-sans text-sm text-ink-100 transition-colors hover:text-brass"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </aside>
  );
}
