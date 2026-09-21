'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Project } from '@/types';
import { SmartImage } from '@/components/ui/SmartImage';
import { Container } from '@/components/ui/Container';

/**
 * Pinned horizontal-scroll section, driven entirely by Framer Motion
 * (useScroll + useTransform → a CSS transform applied through React).
 *
 * Deliberately NOT using GSAP ScrollTrigger's pin here: ScrollTrigger's pin
 * inserts a wrapper element directly into the DOM outside React's control.
 * If the component unmounts (route change) while that insertion is
 * in flight, React's own reconciliation can find a DOM tree that no longer
 * matches what it created, throwing
 * "NotFoundError: Failed to execute 'removeChild' on 'Node'".
 * Doing the transform as a plain React-controlled style avoids that
 * entire class of bug — the DOM structure never changes, only a style value.
 */
export function HorizontalStories({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const prefersReduced = useReducedMotion();

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const viewportWidth = window.innerWidth;
      setDistance(Math.max(0, track.scrollWidth - viewportWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [projects.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section className="bg-ink">
      <Container className="pb-6 pt-10 md:pt-16">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-brass" aria-hidden />
          <h2 className="font-serif text-display-3 text-ink-50">Selected Stories →</h2>
        </div>
      </Container>

      {/* Desktop / tablet: pinned horizontal scroll. Height drives scroll distance 1:1 with `distance` (px). */}
      <div
        ref={containerRef}
        className="relative hidden md:block"
        style={{ height: distance > 0 ? `calc(100vh - 6rem + ${distance}px)` : undefined }}
      >
        <div className="sticky top-24 flex h-[calc(100vh-6rem)] items-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x: prefersReduced ? 0 : x }}
            className="flex gap-8 px-16"
          >
            {projects.map((project) => (
              <StoryCard key={project.id} project={project} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile: normal vertical stack, no scroll-jacking. */}
      <div className="flex flex-col gap-4 px-6 pb-10 md:hidden">
        {projects.map((project) => (
          <StoryCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function StoryCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="OPEN"
      className="group relative block h-[60vh] w-full shrink-0 overflow-hidden md:h-[calc(100vh-10rem)] md:w-[520px]"
    >
      <SmartImage
        src={project.cover_image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-sans text-[11px] uppercase tracking-widest text-brass">
          {project.location}
        </p>
        <h3 className="mt-2 font-serif text-2xl text-ink-50">{project.title}</h3>
      </div>
    </Link>
  );
}
