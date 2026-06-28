# AlisherDev - Portfolio Website

A modern, high-performance portfolio website built with Next.js, TypeScript, React, and Tailwind CSS. Featuring smooth animations with GSAP, responsive design, and a focus on web security and performance.

## Features

- ⚡ **High Performance**: Optimized for Lighthouse with Core Web Vitals
- 🎨 **Modern Design**: Smooth animations and interactive UI with GSAP
- 📱 **Fully Responsive**: Mobile-first approach with Tailwind CSS
- 🔐 **Security-Focused**: Built with security best practices in mind
- ♿ **Accessible**: WCAG 2.1 AA compliant with proper semantic HTML
- 🌙 **Dark Theme**: Beautiful dark-themed UI with neon accents
- 📄 **Resume Builder**: Interactive resume creation and export functionality
- 🎯 **SEO Optimized**: Structured data, meta tags, and Open Graph support

## Tech Stack

- **Framework**: Next.js 14.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + CSS3
- **Animations**: GSAP 3 + Lenis (smooth scrolling)
- **State Management**: Zustand 4
- **Components**: React 18
- **Document Export**: html2canvas + jsPDF

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 10+ (or npm/yarn)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Alisher0903/my-site.git
cd my-site
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env.local
```

4. **Start the development server:**

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint to check code quality
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm validate` - Run all validation tasks (format, lint, type-check)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── projects/          # Projects showcase
│   ├── resume/            # Resume builder page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   ├── CustomCursor.tsx
│   │   └── CustomCursorWrapper.tsx
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   └── resume/            # Resume builder components
│       └── ResumePreview.tsx
├── lib/
│   └── utils.ts          # Utility functions
└── store/
    └── resumeStore.ts    # Zustand store configuration
```

## Development Workflow

### Code Quality Standards

This project enforces strict code quality standards:

1. **Linting**: ESLint checks for code issues
2. **Formatting**: Prettier ensures consistent code style
3. **Type Checking**: TypeScript strict mode
4. **Git Hooks**: Husky + Lint-staged auto-fix on commit
5. **Commit Messages**: Commitlint enforces conventional commits

### Pre-commit Workflow

When you commit, the following checks run automatically:

1. ESLint and Prettier validation
2. Type checking with TypeScript
3. Commit message validation

### Editor Configuration

`.editorconfig` is configured for consistent editor behavior across different IDEs.

## Performance Optimization

- Lazy loading of components and images
- Code splitting and bundle optimization
- CSS-in-JS optimization with Tailwind
- GSAP animations optimized for performance
- Service Worker ready

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML structure
- Skip to main content link
- Focus visible outlines
- Screen reader optimized
- Proper color contrast ratios

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 14+
- Mobile browsers

## Security

For security reporting, please see [SECURITY.md](SECURITY.md)

Key security practices:
- No inline scripts (except safe JSON-LD)
- Content Security Policy ready
- XSS protection
- CSRF protection
- Input validation

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Setup for Contributors

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/my-site.git

# 2. Create feature branch
git checkout -b feat/amazing-feature

# 3. Install and validate
pnpm install
pnpm validate

# 4. Make your changes
# 5. Commit with conventional format
git commit -m "feat: add amazing feature"

# 6. Push and create PR
git push origin feat/amazing-feature
```

## License

MIT License - see LICENSE file for details

## Contact

- **Email**: info@alisherdev.uz
- **Phone**: +998 (90) 880-03-13
- **GitHub**: [Alisher0903](https://github.com/Alisher0903)
- **LinkedIn**: [alisher-sodiqov](https://www.linkedin.com/in/alisher-sodiqov)
- **Twitter**: [@ascyber777](https://x.com/ascyber777)
- **Website**: [alisherdev.uz](https://alisherdev.uz)

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment options
- GSAP for smooth animations
- Tailwind CSS team for utility-first CSS

---

Built with ❤️ and ☕ by [Alisher Sodiqov](https://alisherdev.uz)
