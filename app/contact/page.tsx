import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { BookingForm } from '@/components/contact/BookingForm';
import { fetchServices } from '@/lib/supabase/queries';
import { siteConfig } from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a session or request a quote for wedding, portrait, commercial or event coverage.',
};

export default async function ContactPage() {
  const services = await fetchServices();
  const serviceOptions = services.map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Book a Session"
        description="Tell me a little about your event or project and I'll follow up with availability and a quote."
      />
      <section className="bg-ink section-y">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-widest text-ink-200">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="link-underline font-serif text-lg text-ink-50">
                    {siteConfig.email}
                  </a>
                </div>
                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-widest text-ink-200">Phone</p>
                  <a href={`tel:${siteConfig.phone}`} className="link-underline font-serif text-lg text-ink-50">
                    {siteConfig.phone}
                  </a>
                </div>
                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-widest text-ink-200">Studio</p>
                  <p className="font-serif text-lg text-ink-50">{siteConfig.location}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <Suspense fallback={null}>
                <BookingForm services={serviceOptions} />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
