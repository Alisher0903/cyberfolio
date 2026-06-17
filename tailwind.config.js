/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Syne', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#0d1117',
          tertiary: '#161b27',
        },
        accent: {
          green: '#00ff88',
          blue: '#00b8ff',
          pink: '#ff006e',
          purple: '#a78bfa',
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 2s infinite',
        'grid-move': 'gridMove 20s linear infinite',
        'blink': 'blink 0.8s step-end infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(0,255,136,0.4)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 0 6px rgba(0,255,136,0)' },
        },
        gridMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(60px)' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
