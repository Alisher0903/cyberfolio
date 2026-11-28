import type { Locale } from './index';

/**
 * Content authored in the CMS keeps English as its base language. Uz, Cyrillic
 * and Russian versions are optional overrides stored next to it, so a missing
 * translation always falls back to the authored text instead of showing a gap.
 */
export const CONTENT_LOCALES = ['uz', 'uz-cyrl', 'ru'] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export type TranslationEntry<T> = Partial<Record<ContentLocale, Partial<T>>>;

export interface ProjectTranslation {
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  year?: string;
  /** One label per metric, matched by position with the base metrics. */
  metricLabels?: string[];
}

export interface DetailTranslation {
  challenge?: string;
  solution?: string;
  impact?: string;
  timeline?: string;
  teamSize?: string;
  role?: string;
  highlights?: string[];
}

export interface ExperienceTranslation {
  role?: string;
  company?: string;
  period?: string;
  description?: string;
}

export interface SocialTranslation {
  label?: string;
}

export interface TranslationStore {
  projects?: Record<string, TranslationEntry<ProjectTranslation>>;
  details?: Record<string, TranslationEntry<DetailTranslation>>;
  experiences?: Record<string, TranslationEntry<ExperienceTranslation>>;
  socials?: Record<string, TranslationEntry<SocialTranslation>>;
  settings?: Record<string, TranslationEntry<Record<string, unknown>>>;
}

export function emptyTranslationStore(): TranslationStore {
  return { projects: {}, details: {}, experiences: {}, socials: {}, settings: {} };
}

/** English is the authored base, so it never needs an override. */
export function getTranslation<T>(
  entry: TranslationEntry<T> | undefined,
  locale: Locale,
): Partial<T> | undefined {
  if (!entry || locale === 'en') return undefined;
  const patch = entry[locale as ContentLocale];
  if (!patch) return undefined;
  return Object.values(patch).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value),
  )
    ? patch
    : undefined;
}

/** Copies every non-empty field of `patch` over `base`. */
export function applyTextPatch<T extends object>(base: T, patch: Partial<T> | undefined): T {
  if (!patch) return base;
  const next = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string') {
      if (value.trim() === '') continue;
      next[key] = value;
      continue;
    }
    if (Array.isArray(value) && value.length === 0) continue;
    next[key] = value;
  }
  return next as T;
}

/** Localizes a project card: text fields plus metric labels by position. */
export function localizeProject<T extends { metrics: Array<{ label: string; value: string }> }>(
  project: T,
  entry: TranslationEntry<ProjectTranslation> | undefined,
  locale: Locale,
): T {
  const patch = getTranslation(entry, locale);
  if (!patch) return project;
  const { metricLabels, ...text } = patch;
  const merged = applyTextPatch(project, text as Partial<T>);
  if (metricLabels?.length) {
    merged.metrics = project.metrics.map((metric, index) => {
      const label = metricLabels[index]?.trim();
      return label ? { ...metric, label } : metric;
    });
  }
  return merged;
}

/** Localizes the case-study block of a project detail page. */
export function localizeDetail<T extends { highlights: string[] }>(
  detail: T,
  entry: TranslationEntry<DetailTranslation> | undefined,
  locale: Locale,
): T {
  const patch = getTranslation(entry, locale);
  if (!patch) return detail;
  const merged = applyTextPatch(detail, patch as Partial<T>);
  if (patch.highlights?.length) merged.highlights = patch.highlights;
  return merged;
}

export function localizeExperience<T extends object>(
  experience: T,
  entry: TranslationEntry<ExperienceTranslation> | undefined,
  locale: Locale,
): T {
  return applyTextPatch(experience, getTranslation(entry, locale) as Partial<T> | undefined);
}

export function localizeSocial<T extends object>(
  social: T,
  entry: TranslationEntry<SocialTranslation> | undefined,
  locale: Locale,
): T {
  return applyTextPatch(social, getTranslation(entry, locale) as Partial<T> | undefined);
}

export function localizeSettings<T extends Record<string, unknown>>(
  settings: T,
  entry: TranslationEntry<Record<string, unknown>> | undefined,
  locale: Locale,
): T {
  return applyTextPatch(settings, getTranslation(entry, locale) as Partial<T> | undefined);
}
