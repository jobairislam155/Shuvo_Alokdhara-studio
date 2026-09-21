import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { ProjectNav } from '@/components/project/ProjectNav';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { fetchAdjacentProjects, fetchProjectBySlug } from '@/lib/supabase/queries';
import { projects } from '@/lib/data/projects';
import { FadeIn } from '@/components/animations/RevealText';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await fetchProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.cover_image.startsWith('data:') ? undefined : [project.cover_image],
    },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await fetchProjectBySlug(params.slug);
  if (!project) notFound();

  const { previous, next } = await fetchAdjacentProjects(params.slug);
  const behindTheScenes = project.media?.slice(-2) ?? [];

  return (
    <>
      <section className="relative flex h-[70vh] items-end overflow-hidden bg-ink md:h-[85vh]">
        <SmartImage src={project.cover_image} alt={project.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        <Container className="relative z-10 pb-16">
          <p className="mb-4 font-sans text-xs uppercase tracking-widest text-brass">
            {project.category} — {project.location}
          </p>
          <h1 className="max-w-3xl font-serif text-display-2 text-ink-50">{project.title}</h1>
        </Container>
      </section>

      <section className="border-b border-ink-400 bg-ink section-y">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {project.client && (
              <div>
                <p className="font-sans text-[11px] uppercase tracking-widest text-ink-200">Client</p>
                <p className="mt-2 font-serif text-lg text-ink-50">{project.client}</p>
              </div>
            )}
            <div>
              <p className="font-sans text-[11px] uppercase tracking-widest text-ink-200">Location</p>
              <p className="mt-2 font-serif text-lg text-ink-50">{project.location}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] uppercase tracking-widest text-ink-200">Year</p>
              <p className="mt-2 font-serif text-lg text-ink-50">{project.year}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] uppercase tracking-widest text-ink-200">Category</p>
              <p className="mt-2 font-serif text-lg capitalize text-ink-50">{project.category}</p>
            </div>
          </div>
          <FadeIn className="mt-6 max-w-2xl">
            <p className="font-sans text-base leading-relaxed text-ink-100">{project.description}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-ink section-y">
        <Container>
          <ProjectGallery project={project} />
        </Container>
      </section>

      {behindTheScenes.length > 0 && (
        <section className="border-t border-ink-400 bg-ink section-y">
          <Container>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-brass" aria-hidden />
              <h2 className="font-serif text-display-3 text-ink-50">Behind the Scenes</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {behindTheScenes.map((m) => (
                <div key={m.id} className="relative aspect-[4/3] overflow-hidden">
                  <SmartImage src={m.media_url} alt={m.alt_text} fill className="object-cover" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ProjectNav previous={previous ?? null} next={next ?? null} />
    </>
  );
}
