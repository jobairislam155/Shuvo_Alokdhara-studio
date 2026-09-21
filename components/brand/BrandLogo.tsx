import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/lib/config/site';

/**
 * The studio logo. Two artwork files are rendered (white ink for the dark
 * theme, dark ink for the light theme) and globals.css shows the right one
 * from <html data-theme>, so the swap needs no JavaScript and never flashes.
 *
 * variant="compact" → wordmark + camera (navbar, small spaces)
 * variant="full"    → same, inside the viewfinder corners (hero, footer, loader)
 * variant="mark"    → camera emblem only
 */
const ART = {
  compact: { file: 'logo', width: 1400, height: 193 },
  full: { file: 'logo-full', width: 1600, height: 444 },
  mark: { file: 'mark', width: 263, height: 210 },
} as const;

export function BrandLogo({
  variant = 'compact',
  className,
  priority = false,
  decorative = false,
}: {
  variant?: keyof typeof ART;
  /** Size it with width/height utilities, e.g. "h-8 w-auto". */
  className?: string;
  priority?: boolean;
  /** Set when the studio name is already announced next to the logo. */
  decorative?: boolean;
}) {
  const { file, width, height } = ART[variant];
  const alt = decorative ? '' : siteConfig.studio;

  return (
    <>
      <Image
        src={`/brand/${file}-on-dark.png`}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(min-width: 768px) 560px, 92vw"
        className={cn('brand-on-dark select-none', className)}
        draggable={false}
      />
      <Image
        src={`/brand/${file}-on-light.png`}
        alt=""
        aria-hidden
        width={width}
        height={height}
        sizes="(min-width: 768px) 560px, 92vw"
        className={cn('brand-on-light select-none', className)}
        draggable={false}
      />
    </>
  );
}
