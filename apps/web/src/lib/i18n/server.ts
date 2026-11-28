import 'server-only';
import { cookies, headers } from 'next/headers';
import {
  LOCALE_COOKIE,
  localeFromAcceptLanguage,
  normalizeLocale,
  type Locale,
} from '@alisherdev/shared';

/**
 * Resolves the active locale on the server so the first paint is already
 * translated: an explicit cookie wins, otherwise the browser's Accept-Language.
 */
export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE)?.value;
  if (stored) return normalizeLocale(stored);
  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get('accept-language'));
}
