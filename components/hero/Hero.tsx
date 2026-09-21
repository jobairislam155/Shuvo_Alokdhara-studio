'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { siteConfig } from '@/lib/config/site';
import { LinkButton } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { SlideshowBackdrop } from '@/components/slideshow/SlideshowBackdrop';
import { ScrollIndicator } from './ScrollIndicator';
import { duotonePlate } from '@/lib/data/placeholder-art';
import type { SlidePhoto } from '@/lib/utils/slideshow';

// Only used if the Photography section has no photos at all yet.
const fallbackSlide: SlidePhoto = {
  id: 'hero-fallback',
  src: duotonePlate('hero-plate', ['#151310', '#B08D57'], siteConfig.studio, 'Photography'),
  alt: siteConfig.studio,
  title: siteConfig.studio,
  slug: '',
  category: '',
};

/** Home-page hero: every Photography photo, one after another. */
export function Hero({ photos }: { photos: SlidePhoto[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
      <SlideshowBackdrop photos={photos.length > 0 ? photos : [fallbackSlide]} variant="hero" />

      <motion.div style={{ opacity }} className="relative z-10 w-full pb-28 pt-36 md:pb-32">
        <Container>
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mb-6 font-sans text-xs uppercase tracking-widest text-brass"
            >
              {siteConfig.tagline}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <BrandLogo variant="full" priority className="h-auto w-[min(92vw,560px)]" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-6 max-w-md font-sans text-base leading-relaxed text-ink-50/85"
            >
              Capturing authentic moments, emotions and stories through photography and film.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <LinkButton href="/photography" variant="solid">
                Explore Work
              </LinkButton>
              <LinkButton href="/contact" variant="outline">
                Book a Session
              </LinkButton>
            </motion.div>
          </div>
        </Container>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
