# AlisherDev Project Documentation

## Project Overview

**AlisherDev** is a modern portfolio website showcasing Alisher Sodiqov's work as a Frontend Developer with expertise in building high-performance, scalable web applications.

### Key Information

- **Owner**: Alisher Sodiqov (@Alisher0903)
- **Email**: info@alisherdev.uz
- **Phone**: +998 (90) 880-03-13
- **Website**: https://alisherdev.uz
- **Repository**: https://github.com/Alisher0903/my-site
- **Framework**: Next.js 14.2 with TypeScript and React 18
- **Deployment**: Vercel (or self-hosted)

## Project Goals

1. **Showcase Portfolio**: Display projects, skills, and experience
2. **Professional Branding**: Establish credibility as a frontend developer
3. **Performance**: Maintain excellent Core Web Vitals scores
4. **Quality**: Demonstrate clean code and best practices
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Resume Management**: Allow dynamic resume creation and export

## Technology Stack

### Core

- **Framework**: Next.js 14.2
- **Language**: TypeScript 5 (strict mode)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3 + custom CSS

### Features

- **Animations**: GSAP 3 + @gsap/react
- **Smooth Scrolling**: Lenis
- **State Management**: Zustand
- **Document Export**: html2canvas + jsPDF
- **Utilities**: clsx, tailwind-merge

### Development

- **Linting**: ESLint 10 + TypeScript support
- **Formatting**: Prettier 3.8
- **Git Hooks**: Husky 9 + Lint-staged
- **Commit Validation**: Commitlint
- **Package Manager**: pnpm 10

## Directory Structure

```
my-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout + metadata
│   │   ├── globals.css        # Global styles + animations
│   │   ├── page.tsx           # Home page
│   │   ├── projects/
│   │   │   └── [slug]/        # Dynamic project pages
│   │   └── resume/            # Resume builder
│   ├── components/
│   │   ├── layout/            # Navbar, cursors
│   │   ├── sections/          # Hero, About, Projects, Skills, Contact
│   │   └── resume/            # Resume preview
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── store/
│       └── resumeStore.ts    # Zustand store (resume state)
├── public/                     # Static assets
├── .github/                    # CI/CD workflows (to be added)
├── .husky/                    # Git hooks
├── .eslintrc.json             # ESLint config
├── .prettierrc                # Prettier config
├── tsconfig.json              # TypeScript config
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind config
└── README.md                  # Project docs
```

## Key Features

### 1. Portfolio Showcase
- Hero section with animations
- Projects grid with filtering
- Skills display with categories
- Contact section with CTA

### 2. Resume Builder
- Dynamic form for resume creation
- Real-time preview
- Export to PDF functionality
- Local state management with Zustand

### 3. Animations & UX
- GSAP timeline animations
- Smooth scroll behavior (Lenis)
- Custom cursor effects
- Glitch text effects
- Scanline animation overlay

### 4. Design System
- Dark theme with neon accents (green #00FF87, cyan #00D4FF)
- Responsive grid layout
- Custom fonts (Syne, DM Sans, JetBrains Mono)
- Focus-visible states for a11y

## Code Quality Standards

### Linting
- ESLint enforces code quality
- No console logs except warn/error
- No unused variables
- Const over let/var

### Formatting
- Prettier ensures consistency
- 2-space indentation
- Single quotes
- 100-char line width
- Trailing commas

### Type Safety
- TypeScript strict mode enabled
- No implicit `any`
- Proper type definitions
- React.FC typing for components

### Git Workflow
- Pre-commit: ESLint + Prettier
- Commit-msg: Conventional commits validation
- Branch naming: feat/, fix/, docs/, etc.

## Development Workflow

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

### Before Committing

```bash
pnpm validate  # format + lint + type-check
```

### Committing

```bash
git commit -m "feat(section): add new feature"
# Type: feat, fix, docs, style, refactor, perf, test, chore, ci
```

## Performance Optimization

### Current Optimizations

- Next.js image optimization
- CSS utilities (Tailwind)
- Code splitting via dynamic imports
- Font preloading in layout

### Metrics to Monitor

- Lighthouse scores (target: 90+)
- Core Web Vitals (LCP, FID, CLS)
- Bundle size

## SEO & Metadata

- Metadata configured in `src/app/layout.tsx`
- Open Graph images
- Twitter card
- Schema.org JSON-LD
- Robots.txt ready

## Security

- No sensitive data in client code
- Proper CSP configuration ready
- No inline scripts (safe JSON-LD only)
- Input validation where needed
- See SECURITY.md for full details

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML structure
- Skip to main content link
- Focus visible outlines
- Screen reader optimized
- Proper heading hierarchy

## Testing

Currently no automated tests. Consider adding:
- Unit tests with Vitest/Jest
- Component tests with React Testing Library
- E2E tests with Playwright/Cypress

## Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Site URL
- `NEXT_PUBLIC_APP_NAME`: App name
- See `.env.example` for full list

### Hosting Options

- **Vercel**: Recommended (by Next.js creators)
- **Netlify**: Full-stack support
- **Self-hosted**: Node.js server

## Future Improvements

1. **Testing**: Add unit and E2E tests
2. **Blog**: Add MDX blog functionality
3. **Analytics**: Implement analytics
4. **Dark Mode Toggle**: Add theme switcher
5. **Newsletter**: Add email subscription
6. **Comments**: Add project comments/feedback
7. **Search**: Add full-text search
8. **Database**: Add backend for dynamic content

## Troubleshooting

### ESLint Issues

```bash
pnpm lint:fix
```

### TypeScript Errors

```bash
pnpm type-check
```

### Formatting Issues

```bash
pnpm format
```

### Port Already in Use

```bash
pnpm dev -p 3001  # Use different port
```

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [GSAP Docs](https://gsap.com/docs)

## Contributing

See CONTRIBUTING.md for contribution guidelines.

## License

MIT License - see LICENSE file

---

**Last Updated**: 2026-06-17
