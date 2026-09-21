'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { mainNav, siteConfig, socialLinks } from '@/lib/config/site';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28"
        >
          <nav className="flex flex-col gap-2">
            {mainNav.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block border-b border-ink-400 py-4 font-serif text-4xl text-ink-50"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + mainNav.length * 0.06, duration: 0.5 }}
              className="pt-6"
            >
              <Link
                href="/contact"
                onClick={onClose}
                className="inline-flex border border-brass px-6 py-3 font-sans text-xs uppercase tracking-widest text-brass"
              >
                Book a Session
              </Link>
            </motion.div>
          </nav>

          <div className="flex items-center justify-between font-sans text-xs uppercase tracking-widest text-ink-100">
            <span>{siteConfig.location}</span>
            <div className="flex items-center gap-5">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-underline">
                  {s.label}
                </a>
              ))}
              <ThemeToggle className="h-auto w-auto text-ink-100" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
