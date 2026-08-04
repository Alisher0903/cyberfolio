import { projects as fallbackProjects } from '@/data/projects';
import { projectDetails } from '@/data/project-details';
import type { Project } from '@/types/project';
import type { ProjectDetail } from '@/types/project-detail';

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
  };
}

export async function getPortfolioProjects(): Promise<Project[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return fallbackProjects;
  try {
    const response = await fetch(`${apiUrl}/portfolio`, { next: { revalidate: 60 } });
    if (!response.ok) return fallbackProjects;
    const body = (await response.json()) as { projects: ApiProject[] };
    return body.projects.map((project, index) => mapProject(project, index + 1));
  } catch {
    return fallbackProjects;
  }
}

export async function getPortfolioProject(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/projects/${encodeURIComponent(slug)}`, {
        next: { revalidate: 60 },
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
      // Fall through to the bundled content so the portfolio remains resilient.
    }
  }

  const project = fallbackProjects.find((item) => item.slug === slug);
  return project ? { project, detail: projectDetails[slug] ?? null } : null;
}
