import type { Metadata } from 'next';
import './globals.css';
import { LOCALE_META, translate } from '@alisherdev/shared';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { getRequestLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: translate(locale, 'admin.title'),
    description: translate(locale, 'admin.description'),
    robots: { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  return (
    <html lang={LOCALE_META[locale].htmlLang}>
      <body>
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
