import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { FadeIn } from '@/components/animations/RevealText';
import { fetchServices, fetchSlideshowPhotos } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Wedding, engagement, travel, fashion and product launch photography and cinematography packages.',
};

export default async function ServicesPage() {
  const [services, slides] = await Promise.all([fetchServices(), fetchSlideshowPhotos()]);

  return (
    <>
      <PageHeader
        eyebrow="What I Offer"
        title="Services"
        description="Every project starts with a conversation. Here's the shape most of them take."
        photos={slides}
      />
      <section className="bg-ink section-y">
        <Container>
          <div className="flex flex-col divide-y divide-ink-400 border-t border-ink-400">
            {services.map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.04}>
                <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-12 md:items-center md:gap-10">
                  <div className="relative aspect-[4/3] overflow-hidden md:col-span-4">
                    <SmartImage src={service.image} alt={service.title} fill className="object-cover" />
                  </div>
                  <div className="md:col-span-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h2 className="font-serif text-2xl text-ink-50 md:text-3xl">{service.title}</h2>
                      {service.price && (
                        <p className="font-serif text-xl text-brass md:text-2xl">{service.price}</p>
                      )}
                    </div>
                    {service.badge && (
                      <span className="mt-3 inline-flex border border-brass/60 px-3 py-1 font-sans text-[11px] uppercase tracking-widest text-brass">
                        {service.badge}
                      </span>
                    )}
                    <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-ink-100">
                      {service.description}
                    </p>
                    <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                      {service.deliverables.map((d) => (
                        <li key={d} className="font-sans text-xs uppercase tracking-widest text-ink-200">
                          {d}
                        </li>
                      ))}
                    </ul>
                    {service.note && (
                      <p className="mt-5 font-sans text-xs leading-relaxed text-ink-100">
                        📩 {service.note}
                      </p>
                    )}
                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="mt-6 inline-flex border border-brass/60 px-6 py-3 font-sans text-xs uppercase tracking-widest text-ink-50 transition-colors duration-300 hover:bg-brass hover:text-ink"
                    >
                      {service.price?.startsWith('BDT') ? 'Book This Package' : 'Request a Quote'}
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
