import type { Project } from '@/types/project';
import type { ProjectDetail } from '@/types/project-detail';
import { getProjectImageUrl } from './project-image';

interface ApiProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  color: string;
  accent_color: string;
  category: string;
  year: string;
  live_url: string;
  github_url: string;
  metrics: Array<{ label: string; value: string }>;
  featured: boolean;
  cover_image_path?: string | null;
  project_details?: ApiDetail | ApiDetail[] | null;
}

interface ApiDetail {
  challenge: string;
  solution: string;
  impact: string;
  timeline: string;
  team_size: string;
  role: string;
  highlights: string[];
  code_snippet: string;
}

function mapProject(project: ApiProject, id: number): Project {
  return {
    id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    tech: project.tech,
    color: project.color,
    accentColor: project.accent_color,
    category: project.category,
    year: project.year,
    link: project.live_url,
    github: project.github_url,
    metrics: project.metrics,
    featured: project.featured,
    coverImage: getProjectImageUrl(project.cover_image_path),
  };
}

export async function getPortfolioProjects(): Promise<Project[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const response = await fetch(`${apiUrl}/portfolio`, {
      next: { revalidate: 60 },
      signal: globalThis.AbortSignal.timeout(10000),
    });
    if (!response.ok) return [];
    const body = (await response.json()) as { projects: ApiProject[] };
    return body.projects.map((project, index) => mapProject(project, index + 1));
  } catch {
    return [];
  }
}

export async function getPortfolioProject(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/projects/${encodeURIComponent(slug)}`, {
        next: { revalidate: 60 },
        signal: globalThis.AbortSignal.timeout(10000),
      });
      if (response.ok) {
        const remote = (await response.json()) as ApiProject;
        const rawDetail = Array.isArray(remote.project_details)
          ? remote.project_details[0]
          : remote.project_details;
        const detail: ProjectDetail | null = rawDetail
          ? {
              challenge: rawDetail.challenge,
              solution: rawDetail.solution,
              impact: rawDetail.impact,
              timeline: rawDetail.timeline,
              teamSize: rawDetail.team_size,
              role: rawDetail.role,
              highlights: rawDetail.highlights,
              codeSnippet: rawDetail.code_snippet,
            }
          : null;
        return { project: mapProject(remote, 1), detail };
      }
    } catch {
      // Do not substitute another project's content when the API is unavailable.
    }
  }

  return null;
}
