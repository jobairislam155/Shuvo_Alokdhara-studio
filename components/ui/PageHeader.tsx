import { Container } from './Container';
import { RevealText } from '@/components/animations/RevealText';
import { SlideshowBackdrop } from '@/components/slideshow/SlideshowBackdrop';
import { cn } from '@/lib/utils/cn';
import type { SlidePhoto } from '@/lib/utils/slideshow';

/**
 * Page title block. Pass `photos` to play the Photography slideshow behind
 * the title (Photography, Videography and Services do this); omit it for a
 * plain header.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  photos,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  photos?: SlidePhoto[];
}) {
  const hasSlides = Boolean(photos && photos.length > 0);

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden border-b border-ink-400 bg-ink',
        hasSlides && 'flex min-h-[64svh] items-end md:min-h-[72svh]',
      )}
    >
      {hasSlides && photos ? <SlideshowBackdrop photos={photos} variant="banner" /> : null}

      <div
        className={cn(
          'relative z-10 w-full',
          hasSlides ? 'pb-20 pt-36 md:pb-24' : 'pb-10 pt-32 md:pb-14 md:pt-40',
        )}
      >
        <Container>
          {eyebrow ? (
            <p className="mb-4 font-sans text-xs uppercase tracking-widest text-brass">{eyebrow}</p>
          ) : null}
          <RevealText as="h1" className="font-serif text-display-2 text-ink-50">
            {title}
          </RevealText>
          {description ? (
            <p
              className={cn(
                'mt-5 max-w-xl font-sans text-base leading-relaxed',
                hasSlides ? 'text-ink-50/85' : 'text-ink-100',
              )}
            >
              {description}
            </p>
          ) : null}
        </Container>
      </div>
    </div>
  );
}
