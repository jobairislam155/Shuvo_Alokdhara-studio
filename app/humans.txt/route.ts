import { developer } from '@/lib/config/developer';
import { siteConfig } from '@/lib/config/site';

export const dynamic = 'force-static';

const line = (label: string, value: string) => (value ? `${label}: ${value}` : null);

/** /humans.txt — a conventional, out-of-sight place for the developer credit. */
export function GET() {
  const lines = [
    '/* DEVELOPER */',
    line('Name', developer.name),
    line('Role', developer.role),
    line('Email', developer.email),
    line('Phone', developer.phone),
    line('WhatsApp', developer.whatsapp && `https://wa.me/${developer.whatsapp}`),
    line('Facebook', developer.facebook),
    line('LinkedIn', developer.linkedin),
    line('Portfolio', developer.portfolio),
    '',
    '/* SITE */',
    `Client: ${siteConfig.studio}`,
    'Built with: Next.js, TypeScript, Tailwind CSS, Framer Motion',
    '',
  ].filter((l): l is string => l !== null);

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
