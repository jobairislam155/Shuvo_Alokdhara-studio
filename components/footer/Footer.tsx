import Link from 'next/link';
import { mainNav, siteConfig, socialLinks } from '@/lib/config/site';
import { Container } from '@/components/ui/Container';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { DeveloperCredit } from './DeveloperCredit';

export function Footer() {
  return (
    <footer className="border-t border-ink-400 bg-ink pb-6 pt-12 md:pt-16">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1.5fr] md:gap-8">
          {/* Left — brand */}
          <div className="max-w-xs">
            <BrandLogo variant="full" className="h-auto w-64" />
            <p className="mt-5 font-sans text-xs uppercase tracking-widest text-ink-100">
              {siteConfig.tagline}
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ink-100">
              {siteConfig.description}
            </p>
          </div>

          {/* Middle — contact */}
          <div className="md:justify-self-center">
            <p className="mb-4 font-sans text-[11px] uppercase tracking-widest text-ink-200">
              Contact
            </p>
            <ul className="space-y-3 font-sans text-sm text-ink-100">
              <li>{siteConfig.location}</li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="link-underline hover:text-ink-50">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="link-underline hover:text-ink-50">
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Right — navigation and social */}
          <div className="grid grid-cols-2 gap-8 md:justify-self-end md:gap-14">
            <div>
              <p className="mb-4 font-sans text-[11px] uppercase tracking-widest text-ink-200">
                Navigate
              </p>
              <ul className="space-y-3">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline font-sans text-sm text-ink-100 hover:text-ink-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 font-sans text-[11px] uppercase tracking-widest text-ink-200">
                Follow
              </p>
              <ul className="space-y-3">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline font-sans text-sm text-ink-100 hover:text-ink-50"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 border-t border-ink-400 pt-5 font-sans text-xs text-ink-200 md:grid-cols-3 md:items-center">
          {/* Left corner — developer credit */}
          <div className="md:justify-self-start">
            <DeveloperCredit />
          </div>

          {/* Middle — admin */}
          <div className="md:justify-self-center">
            <Link href="/admin" className="link-underline">
              Studio Admin
            </Link>
          </div>

          {/* Right — copyright */}
          <p className="flex items-center gap-3 md:justify-self-end">
            <BrandLogo variant="mark" decorative className="h-5 w-auto" />
            <span>
              Copyright © {new Date().getFullYear()} {siteConfig.studio}. All rights reserved.
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
