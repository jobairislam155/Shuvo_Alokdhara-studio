import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site';
import { projects } from '@/lib/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/photography', '/videography', '/about', '/services', '/contact'].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
    }),
  );

  const projectRoutes = projects
    .filter((p) => p.published)
    .map((p) => ({
      url: `${siteConfig.url}/projects/${p.slug}`,
      lastModified: new Date(),
    }));

  return [...staticRoutes, ...projectRoutes];
}
