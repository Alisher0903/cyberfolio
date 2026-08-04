'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { projects as fallbackProjects } from '@/data/projects';
import { experience as fallbackExperience } from '@/data/home';
import { skills as fallbackSkills } from '@/data/skills';
import type { Project } from '@/types/project';

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: readonly string[];
}

export interface SocialItem {
  label: string;
  handle: string;
  href: string;
  color: string;
}

interface PortfolioData {
  projects: Project[];
  experience: ExperienceItem[];
  skills: Record<string, readonly string[]>;
  socials: SocialItem[];
  settings: Record<string, Record<string, unknown>>;
  isRemote: boolean;
}

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
}

interface ApiPortfolio {
  projects: ApiProject[];
  experiences: ExperienceItem[];
  skills: Array<{ name: string; skills: string[] }>;
  socials: SocialItem[];
  settings: Record<string, Record<string, unknown>>;
}

const fallbackSocials: SocialItem[] = [
  { label: 'GitHub', handle: '@Alisher0903', href: 'https://github.com/Alisher0903', color: '#E8F4FD' },
  { label: 'LinkedIn', handle: 'in/alisher-sodiqov-491183310', href: 'https://www.linkedin.com/in/alisher-sodiqov-491183310', color: '#0A66C2' },
  { label: 'Twitter', handle: '@ascyber777', href: 'https://x.com/ascyber777', color: '#1DA1F2' },
  { label: 'Email', handle: 'info@alisherdev.uz', href: 'mailto:info@alisherdev.uz', color: '#00FF87' },
];

const initialData: PortfolioData = {
  projects: fallbackProjects,
  experience: [...fallbackExperience],
  skills: fallbackSkills,
  socials: fallbackSocials,
  settings: {},
  isRemote: false,
};

const PortfolioContext = createContext<PortfolioData>(initialData);

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(initialData);

  useEffect(() => {
    const controller = new AbortController();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return controller.abort();

    fetch(`${apiUrl}/portfolio`, { signal: controller.signal, next: { revalidate: 60 } })
      .then((response) => {
        if (!response.ok) throw new Error('Portfolio API unavailable');
        return response.json() as Promise<ApiPortfolio>;
      })
      .then((remote) => {
        const projects: Project[] = remote.projects.map((project, index) => ({
          id: index + 1,
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
        }));
        const skills = Object.fromEntries(remote.skills.map((category) => [category.name, category.skills]));
        setData({
          projects: projects.length ? projects : fallbackProjects,
          experience: remote.experiences.length ? remote.experiences : [...fallbackExperience],
          skills: remote.skills.length ? skills : fallbackSkills,
          socials: remote.socials.length ? remote.socials : fallbackSocials,
          settings: remote.settings ?? {},
          isRemote: true,
        });
      })
      .catch(() => {
        // Static data remains available when the free Supabase project is paused or offline.
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(() => data, [data]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioData() {
  return useContext(PortfolioContext);
}
