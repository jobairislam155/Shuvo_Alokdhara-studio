import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { PhotographyClient } from '@/components/gallery/PhotographyClient';
import { fetchProjectsByCategory } from '@/lib/supabase/queries';
import { projectsToSlides } from '@/lib/utils/slideshow';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A full portfolio of wedding, portrait, fashion, event, commercial and travel photography.',
};

export default async function PhotographyPage() {
  const projects = await fetchProjectsByCategory('all');

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Photography"
        description="A collection of weddings, portraits, fashion, events, commercial work and personal travel projects."
        photos={projectsToSlides(projects)}
      />
      <section className="bg-ink section-y">
        <Container>
          <PhotographyClient projects={projects} />
        </Container>
      </section>
    </>
  );
}
