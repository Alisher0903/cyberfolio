import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import ResumeBuilderClient from './ResumeBuilderClient';
import { translate, LOCALE_META } from '@alisherdev/shared';
import { getRequestLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const title = translate(locale, 'resume.title');
  const description = translate(locale, 'resume.metaDescription');
  return {
    title,
    description,
    alternates: {
      canonical: '/resume',
    },
    openGraph: {
      locale: LOCALE_META[locale].ogLocale,
      title,
      description,
      url: `${siteConfig.url}/resume`,
      type: 'website',
      images: [
        {
          url: `${siteConfig.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${title} by ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.url}/opengraph-image`],
    },
  };
}

export default function ResumePage() {
  return <ResumeBuilderClient />;
}
