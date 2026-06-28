import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import CustomCursorWrapper from '@/components/layout/CustomCursorWrapper';
import PageProgressBar from '@/components/layout/PageProgressBar';
import ScrollProgressBar from '@/components/layout/ScrollProgressBar';
import ToTopButton from '@/components/layout/ToTopButton';
import { siteConfig } from '@/config/site';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050A0E',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.siteName,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  category: 'technology',
  keywords: [
    'frontend developer',
    'React',
    'TypeScript',
    'Next.js',
    'Tailwind CSS',
    'web development',
    'UI/UX',
    'Tashkent',
    'Uzbekistan',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@ascyber777',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}/#person`,
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: 'Frontend Developer',
        knowsAbout: ['React', 'Next.js', 'TypeScript', 'Web Accessibility', 'Frontend Development'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tashkent',
          addressCountry: 'UZ',
        },
        sameAs: [siteConfig.github, siteConfig.linkedin, siteConfig.twitter],
        email: siteConfig.email,
        telephone: siteConfig.phone,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        name: siteConfig.siteName,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: 'en',
        publisher: { '@id': `${siteConfig.url}/#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteConfig.url}/#webpage`,
        url: siteConfig.url,
        name: siteConfig.title,
        isPartOf: { '@id': `${siteConfig.url}/#website` },
        mainEntity: { '@id': `${siteConfig.url}/#person` },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetBrainsMono.variable} ${syne.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <PageProgressBar />
        </Suspense>
        <ScrollProgressBar />
        <ToTopButton />

        {/* Global custom cursor — renders on ALL pages */}
        <CustomCursorWrapper />

        {/* Scanline effect — global */}
        <div className="scanline" aria-hidden="true" />

        {/* Skip to main content — a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded focus:font-mono focus:text-sm"
          style={{ backgroundColor: '#00FF87', color: '#050A0E' }}
        >
          Skip to main content
        </a>

        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
