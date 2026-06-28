export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: number;
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
}
