import type { MetadataRoute } from 'next';
import { projects as fallbackProjects } from '@/data/projects';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects = fallbackProjects;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/portfolio`, { next: { revalidate } });
      if (response.ok) {
        const data = (await response.json()) as { projects?: typeof fallbackProjects };
        if (Array.isArray(data.projects)) projects = data.projects;
      }
    } catch {
      // Keep the bundled project list when the API is temporarily unavailable.
    }
  }

  const projectPages = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/resume`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...projectPages,
  ];
}
