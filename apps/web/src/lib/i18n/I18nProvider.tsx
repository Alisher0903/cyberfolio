'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_META,
  collate,
  formatDate,
  translate,
  normalizeLocale,
  type Locale,
  type MessageKey,
  type TranslateVars,
} from '@alisherdev/shared';

interface I18nValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: MessageKey, vars?: TranslateVars) => string;
  collate: (a: string, b: string) => number;
  formatDate: (value: Date | string | number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readCookieLocale(): Locale | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((entry) => entry.startsWith(`${LOCALE_COOKIE}=`));
  try {
    return match ? normalizeLocale(decodeURIComponent(match.split('=').slice(1).join('='))) : null;
  } catch {
    return null;
  }
}

function writeCookieLocale(locale: Locale) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  // Share the choice between the site and the admin panel on the same parent domain.
  const host = window.location.hostname;
  const domain =
    host === 'alisherdev.uz' || host.endsWith('.alisherdev.uz') ? '; Domain=.alisherdev.uz' : '';
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${domain}${secure}`;
}

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(normalizeLocale(initialLocale));

  // The server already rendered the cookie value; this only covers a stale cookie
  // written by another tab or by the admin panel on a different sub-domain.
  useEffect(() => {
    setLocaleState(normalizeLocale(initialLocale));
  }, [initialLocale]);

  useEffect(() => {
    const sync = () => {
      const stored = readCookieLocale();
      if (stored && stored !== locale) {
        setLocaleState(stored);
        router.refresh();
      }
    };
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, [locale, router]);

  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].htmlLang;
    document.documentElement.setAttribute('data-locale', locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      const normalized = normalizeLocale(next);
      writeCookieLocale(normalized);
      setLocaleState(normalized);
      document.documentElement.lang = LOCALE_META[normalized].htmlLang;
      document.documentElement.setAttribute('data-locale', normalized);
      // Re-render server components (metadata, project pages) in the new language.
      router.refresh();
    },
    [router],
  );

  const value = useMemo<I18nValue>(() => {
    return {
      locale,
      setLocale,
      t: (key, vars) => {
        return translate(locale, key, vars);
      },
      collate: (a, b) => collate(locale, a, b),
      formatDate: (value) => formatDate(locale, value),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside <I18nProvider>');
  }
  return context;
}

export { DEFAULT_LOCALE };
