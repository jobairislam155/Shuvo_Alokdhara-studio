'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Facebook, Globe, Linkedin, Mail, MessageCircle, Phone, X } from 'lucide-react';
import { developer } from '@/lib/config/developer';

/**
 * "Developed by: <name>" credit for the footer's bottom-left corner.
 * With a portfolio URL the name is a link; otherwise it opens a contact
 * card when contact details exist. Details live in lib/config/developer.ts.
 */
export function DeveloperCredit() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const trigger = triggerRef.current;
    return () => {
      window.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [open]);

  const contacts = [
    developer.email && {
      icon: Mail,
      label: developer.email,
      href: `mailto:${developer.email}`,
    },
    developer.phone && {
      icon: Phone,
      label: developer.phone,
      href: `tel:${developer.phone.replace(/[^\d+]/g, '')}`,
    },
    developer.whatsapp && {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/${developer.whatsapp.replace(/\D/g, '')}`,
    },
    developer.facebook && { icon: Facebook, label: 'Facebook', href: developer.facebook },
    developer.linkedin && { icon: Linkedin, label: 'LinkedIn', href: developer.linkedin },
    developer.portfolio && { icon: Globe, label: 'Portfolio', href: developer.portfolio },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string }[];

  return (
    <>
      <p className="flex flex-wrap items-center justify-center gap-x-1.5 md:justify-start">
        <span>Developed by:</span>
        {developer.portfolio ? (
          <a
            href={developer.portfolio}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-ink-50 hover:text-brass"
          >
            {developer.name}
          </a>
        ) : contacts.length > 0 ? (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="link-underline text-ink-50 hover:text-brass"
          >
            {developer.name}
          </button>
        ) : (
          <span className="text-ink-50">{developer.name}</span>
        )}
        {developer.portfolio && contacts.length > 0 && (
          <>
            <span aria-hidden>·</span>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              className="link-underline hover:text-brass"
            >
              Contact
            </button>
          </>
        )}
      </p>

      <AnimatePresence>
        {open && contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/80 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="developer-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm border border-ink-300 bg-ink-500 p-7"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-ink-100 transition-colors hover:text-brass"
              >
                <X size={18} />
              </button>

              <p className="font-sans text-xs uppercase tracking-widest text-brass">Website by</p>
              <h2 id="developer-title" className="mt-3 font-serif text-2xl text-ink-50">
                {developer.name}
              </h2>
              {developer.role && (
                <p className="mt-1 font-sans text-sm text-ink-100">{developer.role}</p>
              )}
              {developer.note && (
                <p className="mt-4 font-sans text-sm leading-relaxed text-ink-100">{developer.note}</p>
              )}

              {contacts.length > 0 && (
                <ul className="mt-6 space-y-1 border-t border-ink-400 pt-4">
                  {contacts.map(({ icon: Icon, label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer' : undefined}
                        className="flex items-center gap-3 py-2 font-sans text-sm text-ink-50 transition-colors hover:text-brass"
                      >
                        <Icon size={16} className="shrink-0 text-brass" aria-hidden />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
