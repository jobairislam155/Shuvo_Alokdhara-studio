import Link from 'next/link';
import { Project } from '@/types';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { FadeIn } from '@/components/animations/RevealText';
import { LinkButton } from '@/components/ui/Button';

const spans = [
  'md:col-span-7 md:row-span-2',
  'md:col-span-5 md:row-span-1',
  'md:col-span-5 md:row-span-1',
  'md:col-span-6 md:row-span-2',
  'md:col-span-6 md:row-span-2',
];

export function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <section className="bg-ink section-y">
      <Container>
        <div className="mb-8 flex flex-wrap md:mb-10 items-end justify-between gap-8">
          <SectionHeading
            title="Selected Work"
            description="A curated edit of recent weddings, portraits and commercial stories."
          />
          <LinkButton href="/photography" variant="ghost" size="sm" className="px-0">
            View full portfolio
          </LinkButton>
        </div>

        <div className="grid grid-cols-1 gap-4 md:auto-rows-[240px] md:grid-cols-12">
          {projects.map((project, i) => (
            <FadeIn
              key={project.id}
              delay={i * 0.06}
              className={`group relative overflow-hidden ${spans[i % spans.length]}`}
            >
              <Link
                href={`/projects/${project.slug}`}
                data-cursor="OPEN"
                className="relative block h-full min-h-[320px] w-full md:min-h-0"
              >
                <SmartImage
                  src={project.cover_image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:translate-y-2 md:opacity-90 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-widest text-brass">
                      {project.category}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-ink-50">{project.title}</h3>
                  </div>
                  <span className="hidden font-sans text-xs text-ink-100 md:block">
                    {project.year}
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
