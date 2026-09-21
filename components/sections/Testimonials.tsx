'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '@/types';
import { Container } from '@/components/ui/Container';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (testimonials.length === 0) return null;
  const current = testimonials[index] ?? testimonials[0];
  if (!current) return null;

  const go = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-ink section-y">
      <Container className="max-w-3xl text-center">
        <div className="relative min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-serif text-2xl leading-snug text-ink-50 md:text-3xl">
                &ldquo;{current.testimonial}&rdquo;
              </blockquote>
              <figcaption className="mt-8 font-sans text-xs uppercase tracking-widest text-ink-100">
                {current.client_name} — {current.project_type}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            className="text-ink-100 transition-colors hover:text-brass"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? 'bg-brass' : 'bg-ink-300'
                }`}
              />
            ))}
          </div>
          <button
            aria-label="Next testimonial"
            onClick={() => go(1)}
            className="text-ink-100 transition-colors hover:text-brass"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </Container>
    </section>
  );
}
