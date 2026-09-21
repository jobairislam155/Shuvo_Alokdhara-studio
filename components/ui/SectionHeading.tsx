import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <div className={cn('flex items-center gap-4', align === 'center' && 'justify-center')}>
        <span className="h-px w-10 bg-brass" aria-hidden />
        <h2 className="font-serif text-display-3 text-ink-50">{title}</h2>
      </div>
      {description ? (
        <p className="max-w-md font-sans text-sm leading-relaxed text-ink-100">{description}</p>
      ) : null}
    </div>
  );
}
