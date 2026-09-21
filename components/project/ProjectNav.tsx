import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Project } from '@/types';
import { Container } from '@/components/ui/Container';

export function ProjectNav({
  previous,
  next,
}: {
  previous: Project | null;
  next: Project | null;
}) {
  if (!previous && !next) return null;

  return (
    <div className="border-t border-ink-400 bg-ink py-8">
      <Container className="flex items-center justify-between gap-6">
        {previous ? (
          <Link
            href={`/projects/${previous.slug}`}
            data-cursor="OPEN"
            className="group flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-ink-100 transition-colors hover:text-brass"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Previous Project</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            data-cursor="OPEN"
            className="group flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-ink-100 transition-colors hover:text-brass"
          >
            <span className="hidden sm:inline">Next Project</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <span />
        )}
      </Container>
    </div>
  );
}
