/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://kxwuqulepsuwnlvygfij.supabase.co",
      "connect-src 'self' https://api.alisherdev.uz",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), usb=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/Alisher0903',
        permanent: false,
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/in/alisher-sodiqov-491183310',
        permanent: false,
      },
      {
        source: '/twitter',
        destination: 'https://x.com/ascyber777',
        permanent: false,
      },
      {
        source: '/email',
        destination: 'mailto:info@alisherdev.uz',
        permanent: false,
      },
    ];
  },

};

module.exports = nextConfig;
