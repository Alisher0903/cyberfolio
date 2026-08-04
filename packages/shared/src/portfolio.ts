export type PublishStatus = 'draft' | 'published';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  color: string;
  accentColor: string;
  category: string;
  year: string;
  link: string;
  github: string;
  metrics: ProjectMetric[];
  featured: boolean;
  status: PublishStatus;
  sortOrder: number;
}

export interface ProjectDetail {
  projectId: string;
  challenge: string;
  solution: string;
  impact: string;
  timeline: string;
  teamSize: string;
  role: string;
  highlights: string[];
  codeSnippet: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
  status: PublishStatus;
  sortOrder: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  skills: string[];
  status: PublishStatus;
  sortOrder: number;
}

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  href: string;
  color: string;
  status: PublishStatus;
  sortOrder: number;
}
