import { en, type Dictionary, type MessageKey } from './locales/en';
import { uz } from './locales/uz';
import { uzCyrl } from './locales/uz-cyrl';
import { ru } from './locales/ru';

export type { Dictionary, MessageKey };

export const LOCALES = ['uz', 'uz-cyrl', 'ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** English keeps the current production behaviour as the default. */
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'ad_locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export interface LocaleMeta {
  /** Name written in the language itself. */
  label: string;
  /** Short badge shown in the switcher. */
  short: string;
  /** Value for <html lang>. */
  htmlLang: string;
  /** Value for OpenGraph locale. */
  ogLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  uz: { label: 'Oʻzbekcha', short: 'UZ', htmlLang: 'uz-Latn', ogLocale: 'uz_UZ' },
  'uz-cyrl': { label: 'Ўзбекча', short: 'УЗ', htmlLang: 'uz-Cyrl', ogLocale: 'uz_UZ' },
  ru: { label: 'Русский', short: 'RU', htmlLang: 'ru', ogLocale: 'ru_RU' },
  en: { label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  uz,
  'uz-cyrl': uzCyrl,
  ru,
  en,
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Accepts `uz_Cyrl`, `uz-Cyrl`, `UZ`, `ru-RU`, … and falls back to the default. */
export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== 'string') return DEFAULT_LOCALE;
  const raw = value.trim().replace(/_/g, '-').toLowerCase();
  if (!raw) return DEFAULT_LOCALE;
  if (raw === 'uz-cyrl' || raw === 'uzc' || raw === 'uz-cyrl-uz') return 'uz-cyrl';
  if (raw.startsWith('uz-cyrl') || raw.startsWith('uzc')) return 'uz-cyrl';
  if (raw === 'uz' || raw.startsWith('uz-') || raw.startsWith('uzb')) return 'uz';
  if (raw === 'ru' || raw.startsWith('ru-')) return 'ru';
  if (raw === 'en' || raw.startsWith('en-')) return 'en';
  return DEFAULT_LOCALE;
}

/** Picks the best locale from an `Accept-Language` header. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const weighted = header
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(';');
      const quality = params.map((param) => param.trim()).find((param) => param.startsWith('q='));
      return { tag, q: quality ? Number(quality.slice(2)) : 1 };
    })
    .filter((entry) => entry.tag && Number.isFinite(entry.q) && entry.q > 0 && entry.q <= 1)
    .sort((a, b) => b.q - a.q);

  for (const entry of weighted) {
    const normalized = normalizeLocale(entry.tag);
    if (isLocale(normalized)) {
      // Only accept a language we actually ship, not the fallback of an unknown tag.
      const base = entry.tag.trim().replace(/_/g, '-').toLowerCase();
      if (/^(uz|ru|en)(-|$)/.test(base)) {
        return normalized;
      }
    }
  }
  return DEFAULT_LOCALE;
}

export type TranslateVars = Record<string, string | number>;

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/** Translate a key. Missing keys fall back to English, then to the key itself. */
export function translate(locale: Locale, key: MessageKey, vars?: TranslateVars): string {
  const dictionary = getDictionary(locale);
  const template = dictionary[key] ?? en[key] ?? key;
  return interpolate(template, vars);
}

// ── Uzbek Latin alphabet (new order) ───────────────────────────────────────
/**
 * Official Uzbek Latin order after the 2019 reform: digraphs sh, ch, ng sit
 * after z, and oʻ / gʻ are single letters right after o / g. The tutuq belgisi
 * (ʼ) follows ng. Loanwords may still contain c, ts, ya…, which fall back to a
 * stable ordering after the alphabet.
 */
export const UZ_ALPHABET = [
  'a',
  'b',
  'd',
  'e',
  'f',
  'g',
  'gʻ',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'oʻ',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'x',
  'y',
  'z',
  'sh',
  'ch',
  'ng',
  'ʼ',
] as const;

const UZ_INDEX = new Map<string, number>(UZ_ALPHABET.map((unit, index) => [unit, index]));

/** Normalises apostrophes so oʻ / gʻ compare the same however they were typed. */
export function normalizeUzbekApostrophes(value: string): string {
  return value.replace(/[\u2018\u2019\u02BB\u02BC\u2032`´']/g, 'ʼ');
}

function tokenizeUzbek(value: string): string[] {
  const normalized = normalizeUzbekApostrophes(value.toLowerCase()).replace(/[ʻʼ’']/g, 'ʼ');
  const units: string[] = [];
  for (let index = 0; index < normalized.length; index += 1) {
    const pair = normalized.slice(index, index + 2);
    if (pair === 'sh' || pair === 'ch' || pair === 'ng' || pair === 'oʼ' || pair === 'gʼ') {
      units.push(pair.replace('ʼ', 'ʻ'));
      index += 1;
      continue;
    }
    units.push(normalized[index]);
  }
  return units;
}

function unitRank(unit: string): number {
  const direct = UZ_INDEX.get(unit);
  if (direct !== undefined) return direct;
  // c, and any other foreign letter, sorts after the native alphabet but stays stable.
  return 100 + unit.charCodeAt(0) / 1000;
}

/** Locale-aware comparison for Uzbek Latin text using the new alphabet order. */
export function compareUzText(a: string, b: string): number {
  const left = tokenizeUzbek(a);
  const right = tokenizeUzbek(b);
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const diff = unitRank(left[index]) - unitRank(right[index]);
    if (diff !== 0) return diff;
  }
  return left.length - right.length;
}

const intlCollators = new Map<Locale, Intl.Collator>();

export function getCollator(locale: Locale): Intl.Collator {
  const cached = intlCollators.get(locale);
  if (cached) return cached;
  const collator = new Intl.Collator(LOCALE_META[locale].htmlLang, {
    sensitivity: 'base',
    numeric: true,
  });
  intlCollators.set(locale, collator);
  return collator;
}

/** Sort strings alphabetically for the active locale (Uzbek uses its own alphabet). */
export function collate(locale: Locale, a: string, b: string): number {
  if (locale === 'uz') return compareUzText(a, b) || getCollator(locale).compare(a, b);
  return getCollator(locale).compare(a, b);
}

export function sortLocalized(values: readonly string[], locale: Locale): string[] {
  return [...values].sort((a, b) => collate(locale, a, b));
}

export function formatDate(locale: Locale, value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(LOCALE_META[locale].htmlLang, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(LOCALE_META[locale].htmlLang).format(value);
}

export * from './content';
