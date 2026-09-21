import Link from 'next/link';
import { Service } from '@/types';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeIn } from '@/components/animations/RevealText';
import { ArrowUpRight } from 'lucide-react';

export function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="border-y border-ink-400 bg-ink section-y">
      <Container>
        <SectionHeading title="Services" description="Wedding, pre-wedding, travel, fashion and product launch packages, from a single shoot to full cinematic coverage." />

        <div className="mt-8 divide-y divide-ink-400 border-t border-ink-400">
          {services.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.04}>
              <Link
                href="/services"
                className="group flex items-center justify-between gap-6 py-5 transition-colors hover:text-brass"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-sans text-xs text-ink-200">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-serif text-xl text-ink-50 transition-colors group-hover:text-brass md:text-3xl">
                    {service.title}
                  </h3>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  {service.price?.startsWith('BDT') && (
                    <span className="hidden font-sans text-xs uppercase tracking-widest text-ink-200 transition-colors group-hover:text-brass sm:inline">
                      {service.price.replace('.00', '')}
                    </span>
                  )}
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-ink-100 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brass"
                    aria-hidden
                  />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
