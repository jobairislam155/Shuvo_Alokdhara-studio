import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-ink">
      <Container className="text-left">
        <p className="font-serif text-display-1 leading-none text-ink-400">404</p>
        <h1 className="mt-6 font-serif text-display-3 text-ink-50">
          This moment
          <br />
          doesn&rsquo;t exist.
        </h1>
        <Link
          href="/"
          className="link-underline mt-8 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-brass"
        >
          Return Home →
        </Link>
      </Container>
    </section>
  );
}
