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
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_META,
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
  formatDate: (value: Date | string | number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function writeCookieLocale(locale: Locale) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
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

  useEffect(() => {
    setLocaleState(normalizeLocale(initialLocale));
  }, [initialLocale]);

  useEffect(() => {
    const sync = () => {
      try {
        const cookie = document.cookie
          .split('; ')
          .find((value) => value.startsWith(`${LOCALE_COOKIE}=`));
        if (!cookie) return;
        const next = normalizeLocale(decodeURIComponent(cookie.slice(LOCALE_COOKIE.length + 1)));
        if (next !== locale) {
          setLocaleState(next);
          router.refresh();
        }
      } catch {
        /* Ignore malformed cookies. */
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
      formatDate: (value) => formatDate(locale, value),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}
