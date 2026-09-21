'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils/cn';

interface VideoPlayerProps {
  title: string;
  poster: string;
  videoUrl?: string;
  className?: string;
  aspect?: string;
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export function VideoPlayer({
  title,
  poster,
  videoUrl,
  className,
  aspect = 'aspect-video',
  playing: controlledPlaying,
  onPlayingChange,
}: VideoPlayerProps) {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const playing = controlledPlaying ?? internalPlaying;
  const setPlaying = (value: boolean) => {
    setInternalPlaying(value);
    onPlayingChange?.(value);
  };

  if (playing) {
    return (
      <div className={cn('relative overflow-hidden bg-ink-500', aspect, className)}>
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={poster.startsWith('data:') ? undefined : poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="font-serif text-xl text-ink-50">{title}</p>
            <p className="max-w-xs font-sans text-sm text-ink-100">
              This film will play here once footage is uploaded through Cloudinary.
            </p>
            <button
              onClick={() => setPlaying(false)}
              className="mt-2 font-sans text-xs uppercase tracking-widest text-brass link-underline"
            >
              Close preview
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      data-cursor="PLAY"
      aria-label={`Play ${title}`}
      className={cn('group relative block w-full overflow-hidden text-left', aspect, className)}
    >
      <SmartImage
        src={poster}
        alt={title}
        fill
        className="object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-ink/30 transition-colors duration-500 group-hover:bg-ink/45" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ink-50/60 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Play className="ml-1 h-5 w-5 text-ink-50" fill="currentColor" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-serif text-lg text-ink-50">{title}</h3>
      </div>
    </button>
  );
}
