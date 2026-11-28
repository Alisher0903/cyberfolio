import { cookies, headers } from 'next/headers';
import {
  LOCALE_COOKIE,
  localeFromAcceptLanguage,
  normalizeLocale,
  type Locale,
} from '@alisherdev/shared';

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE)?.value;
  if (stored) return normalizeLocale(stored);
  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get('accept-language'));
}
