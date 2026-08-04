import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import ResumeBuilderClient from './ResumeBuilderClient';

const title = 'Free Resume Builder';
const description =
  'Build a professional resume with live preview and one-click PDF export directly in your browser.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/resume',
  },
  openGraph: {
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

export default function ResumePage() {
  return <ResumeBuilderClient />;
}
