'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { mainNav } from '@/lib/config/site';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { cn } from '@/lib/utils/cn';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic',
          scrolled || menuOpen
            ? 'border-b border-ink-400 bg-ink/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <Container className="flex h-20 items-center justify-between md:h-24">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            data-cursor="OPEN"
            aria-label="Shuvo Photography — home"
          >
            <BrandLogo priority decorative className="h-7 w-auto md:h-8" />
          </Link>

          <nav className="hidden items-center gap-6 xl:flex 2xl:gap-9">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'link-underline font-sans text-[12px] uppercase tracking-[0.2em] text-ink-100 transition-colors hover:text-ink-50 2xl:text-[13px] 2xl:tracking-widest',
                  pathname === item.href && 'text-ink-50',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden border border-brass/60 px-5 py-2.5 font-sans text-[11px] uppercase tracking-widest text-ink-50 transition-colors duration-300 hover:bg-brass hover:text-ink md:inline-flex"
            >
              Book a Session
            </Link>
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center text-ink-50 xl:hidden"
            >
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.25 }}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
