'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { VideoPlayer } from './VideoPlayer';
import { Button } from '@/components/ui/Button';
import { cldVideo, cldVideoPoster } from '@/lib/cloudinary';

/** Cloudinary public ID of the showreel video. */
const SHOWREEL_VIDEO_ID = 'Mithy_apu_teaser';

const poster = cldVideoPoster(SHOWREEL_VIDEO_ID);

export function Showreel({ videoUrl: customVideoUrl, poster: customPoster }: { videoUrl?: string; poster?: string }) {
  const [playing, setPlaying] = useState(false);

  const videoUrl = customVideoUrl ?? cldVideo(SHOWREEL_VIDEO_ID);

  return (
    <section className="bg-ink section-y">
      <Container>
        <div className="mb-6 flex items-center gap-4">
          <span
            className="h-px w-10 bg-brass"
            aria-hidden="true"
          />

          <h2 className="font-serif text-display-3 text-ink-50">
            Showreel 2026
          </h2>
        </div>

        <VideoPlayer
          title="Showreel 2026"
          poster={customPoster ?? poster}
          videoUrl={videoUrl}
          aspect="aspect-[16/9]"
          playing={playing}
          onPlayingChange={setPlaying}
        />

        <div className="mt-5 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-md font-sans text-sm leading-relaxed text-ink-100">
            Selected moments from weddings, portraits, events and
            commercial productions.
          </p>

          <Button
            variant="ghost"
            size="sm"
            className="px-0"
            onClick={() => setPlaying(true)}
          >
            Watch Full Reel
          </Button>
        </div>
      </Container>
    </section>
  );
}