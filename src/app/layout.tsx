import type { Metadata, Viewport } from 'next'
import './globals.css'
import CustomCursorWrapper from '@/components/layout/CustomCursorWrapper'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050A0E',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://karimov.dev'),
  title: {
    default: 'Alisher Karimov | Frontend SWE & Cybersecurity',
    template: '%s | Alisher Karimov',
  },
  description:
    'Senior Frontend Engineer specializing in secure, high-performance web applications. Next.js, TypeScript, GSAP, and Web Security.',
  keywords: [
    'frontend engineer',
    'cybersecurity',
    'Next.js',
    'TypeScript',
    'React',
    'GSAP',
    'web security',
    'OWASP',
    'Tashkent',
    'Uzbekistan',
  ],
  authors: [{ name: 'Alisher Karimov', url: 'https://karimov.dev' }],
  creator: 'Alisher Karimov',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://karimov.dev',
    siteName: 'Alisher Karimov Portfolio',
    title: 'Alisher Karimov | Frontend SWE & Cybersecurity',
    description: 'Building secure, blazing-fast UIs from the ground up.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Alisher Karimov Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alisher Karimov | Frontend SWE & Cybersecurity',
    description: 'Building secure, blazing-fast UIs from the ground up.',
    images: ['/og-image.png'],
    creator: '@Alisherkarimov_dev',
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
}

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
              name: 'Alisher Karimov',
              url: 'https://karimov.dev',
              jobTitle: 'Senior Frontend Engineer',
              worksFor: { '@type': 'Organization', name: 'SecureNet Labs' },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tashkent',
                addressCountry: 'UZ',
              },
              sameAs: [
                'https://github.com/Alisherkarimov',
                'https://linkedin.com/in/Alisherkarimov',
              ],
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
  )
}
