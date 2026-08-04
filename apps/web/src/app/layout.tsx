import type { Metadata, Viewport } from 'next';
import './globals.css';
import CustomCursorWrapper from '@/components/layout/CustomCursorWrapper';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050A0E',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://alisherdev.uz'),
  title: {
    default: 'Alisher Sodiqov | Frontend Developer',
    template: '%s | Alisher Sodiqov',
  },
  description:
    'Frontend Developer with 2+ years of experience in building high-performance, scalable, and user-friendly web applications. React, TypeScript, Tailwind CSS specialist.',
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
  authors: [{ name: 'Alisher Sodiqov', url: 'https://alisherdev.uz' }],
  creator: 'Alisher Sodiqov',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alisherdev.uz',
    siteName: 'Alisher Sodiqov Portfolio',
    title: 'Alisher Sodiqov | Frontend Developer',
    description: 'Building high-performance, scalable web applications.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Alisher Sodiqov Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alisher Sodiqov | Frontend Developer',
    description: 'Building high-performance, scalable web applications.',
    images: ['/og-image.png'],
    creator: '@ascyber777',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Alisher Sodiqov',
              url: 'https://alisherdev.uz',
              jobTitle: 'Frontend Developer',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tashkent',
                addressCountry: 'UZ',
              },
              sameAs: [
                'https://github.com/Alisher0903',
                'https://www.linkedin.com/in/alisher-sodiqov-491183310',
                'https://x.com/ascyber777',
              ],
              email: 'info@alisherdev.uz',
              telephone: '+998 (90) 880-03-13',
            }),
          }}
        />
      </head>
      <body>
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
      </body>
    </html>
  );
}
