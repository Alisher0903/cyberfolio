'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  localizeExperience,
  localizeProject,
  localizeSettings,
  localizeSocial,
  type TranslationStore,
} from '@alisherdev/shared';
import type { Project } from '@/types/project';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { getProjectImageUrl } from './project-image';

interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: readonly string[];
}

export interface SocialItem {
  id?: string;
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
  translations: TranslationStore | null;
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
  cover_image_path?: string | null;
}

interface ApiPortfolio {
  projects: ApiProject[];
  experiences: ExperienceItem[];
  skills: Array<{ name: string; skills: string[] }>;
  socials: SocialItem[];
  settings: Record<string, Record<string, unknown>>;
  translations?: TranslationStore | null;
}

const fallbackSocials: SocialItem[] = [
  {
    label: 'GitHub',
    handle: '@Alisher0903',
    href: 'https://github.com/Alisher0903',
    color: '#E8F4FD',
  },
  {
    label: 'LinkedIn',
    handle: 'in/alisher-sodiqov',
    href: 'https://www.linkedin.com/in/alisher-sodiqov',
    color: '#0A66C2',
  },
  { label: 'Twitter', handle: '@ascyber777', href: 'https://x.com/ascyber777', color: '#1DA1F2' },
  {
    label: 'Email',
    handle: 'info@alisherdev.uz',
    href: 'mailto:info@alisherdev.uz',
    color: '#00FF87',
  },
];

const initialData: PortfolioData = {
  projects: [],
  experience: [],
  skills: {},
  socials: fallbackSocials,
  settings: {},
  translations: null,
  isRemote: false,
};

const PortfolioContext = createContext<PortfolioData>(initialData);

/** Applies the locale overrides to the authored CMS content. */
function localizeData(
  data: PortfolioData,
  locale: ReturnType<typeof useI18n>['locale'],
): PortfolioData {
  const store = data.translations;
  if (!store) return data;
  return {
    ...data,
    projects: data.projects.map((project) =>
      localizeProject(project, store.projects?.[project.slug], locale),
    ),
    experience: data.experience.map((item) =>
      localizeExperience(item, item.id ? store.experiences?.[item.id] : undefined, locale),
    ),
    socials: data.socials.map((item) =>
      localizeSocial(item, item.id ? store.socials?.[item.id] : undefined, locale),
    ),
    settings: Object.fromEntries(
      Object.entries(data.settings).map(([key, value]) => [
        key,
        localizeSettings(value, store.settings?.[key], locale),
      ]),
    ),
  };
}

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n();
  const [data, setData] = useState<PortfolioData>(initialData);

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem('portfolio:last-known-good');
      if (cached) {
        const saved = JSON.parse(cached) as PortfolioData;
        if (
          Array.isArray(saved.projects) &&
          Array.isArray(saved.experience) &&
          Array.isArray(saved.socials) &&
          saved.skills &&
          saved.settings
        )
          setData(saved);
      }
    } catch {
      // Ignore invalid or unavailable browser storage.
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return controller.abort();

    fetch(`${apiUrl}/portfolio`, { signal: controller.signal, cache: 'no-store' })
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
          coverImage: getProjectImageUrl(project.cover_image_path),
        }));
        const skills = Object.fromEntries(
          remote.skills.map((category) => [category.name, category.skills]),
        );
        const nextData: PortfolioData = {
          projects,
          experience: remote.experiences,
          skills,
          socials: remote.socials.length ? remote.socials : fallbackSocials,
          settings: remote.settings ?? {},
          translations: remote.translations ?? null,
          isRemote: true,
        };
        if (controller.signal.aborted) return;
        setData(nextData);
        try {
          window.localStorage.setItem('portfolio:last-known-good', JSON.stringify(nextData));
        } catch {
          /* Content still works when browser storage is full or blocked. */
        }
      })
      .catch(() => {
        // Keep the last successfully fetched response; never replace it with unrelated demo data.
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(() => localizeData(data, locale), [data, locale]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioData() {
  return useContext(PortfolioContext);
}
