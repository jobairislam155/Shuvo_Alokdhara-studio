import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { Showreel } from '@/components/video/Showreel';
import { VideographyClient } from '@/components/video/VideographyClient';
import { fetchReels, fetchSlideshowPhotos } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'Videography',
  description: 'Wedding films, commercial films, short films, event coverage and social media reels.',
};

export default async function VideographyPage() {
  const [slides, reels] = await Promise.all([fetchSlideshowPhotos(), fetchReels()]);
  const showreel = reels.find((r) => r.showreel);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Videography"
        description="Cinematic storytelling for weddings, brands and events — from feature films to social-ready reels."
        photos={slides}
      />
      <Showreel videoUrl={showreel?.video_url} poster={showreel?.poster_url} />
      <section className="border-t border-ink-400 bg-ink section-y">
        <Container>
          <VideographyClient reels={reels} />
        </Container>
      </section>
    </>
  );
}
